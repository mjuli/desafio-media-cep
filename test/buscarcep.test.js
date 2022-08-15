const request = require('supertest')
const app = require('../server')

describe('GET /buscarcep', () => {
  const URL = '/buscarcep'

  describe('when there is a valid `cep`', () => {
    describe('with a `district`', () => {
      let response

      beforeEach(async() => {
        const validCEP = URL + '?cep=58073197'

        response = await request(app)
          .get(validCEP)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address with the district', () => {
        expect(response.text).toMatch(new RegExp('Bairro: Cidade dos Colibris'))
      })

      it('should not return a warning', () => {
        expect(response.text).not.toMatch(new RegExp('CEP inválido'))
        expect(response.text).not.toMatch(new RegExp('Não foi possível encontrar o Bairro deste CEP'))
      })
    })

    describe('without a `district`', () => {
      let response

      beforeEach(async() => {
        const noDistrictCEP = URL + '?cep=18150000'

        response = await request(app)
          .get(noDistrictCEP)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address without the district', () => {
        expect(response.text).toMatch(new RegExp('Cidade: Ibiúna'))
        expect(response.text).not.toMatch(/Bairro:/)
      })

      it('should return a warning', () => {
        expect(response.text).toMatch(new RegExp('Não foi possível encontrar o bairro deste CEP'))
      })
    })
  })

  describe('when there is an invalid cep', () => {
    let response

    beforeEach(async() => {
      const noDistrictCEP = URL + '?cep=12345678'

      response = await request(app)
        .get(noDistrictCEP)
    })

    it('should return the status code `200`', () => {
      expect(response).toHaveProperty('statusCode', 200)
    })

    it('should return a warning', () => {
      expect(response.text).toMatch(new RegExp('CEP inválido'))
    })
  })

  describe('when there is no cep', () => {
    let response

    beforeEach(async() => {
      response = await request(app)
        .get(URL)
    })

    it('should return the status code `200`', () => {
      expect(response).toHaveProperty('statusCode', 200)
    })

    it('should not return the address', () => {
      expect(response.text).not.toMatch(new RegExp('CEP inválido'))
      expect(response.text).not.toMatch(new RegExp('Não foi possível encontrar o Bairro deste CEP'))
    })
  })
})