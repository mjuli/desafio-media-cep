import request from 'supertest'
import app from '../server'

describe('GET /media', () => {
  const URL = '/media'

  describe('when there are 2 numbers', () => {
    describe('and one is zero', () => {
      const number1 = Math.random()*10_000
      let response

      beforeEach(async() => {
        const number2 = 0

        response = await request(app)
          .get(`${URL}?number1=${number1}&number2=${number2}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address with the media', () => {
        let media = number1 / 2
        media = (Math.round(media * 100) / 100).toFixed(2)
        expect(response.text).toMatch(new RegExp(`Média: ${media}`))
      })

      it('should not return a warning', () => {
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
      })
    })

    describe('and one is negative', () => {
      const number1 = -1 * (Math.random() * 10_000)
      const number2 = Math.random() * 10_000
      let response

      beforeEach(async () => {
        response = await request(app)
          .get(`${URL}?number1=${number1}&number2=${number2}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address with the media', () => {
        let media = (number1  + number2)/ 2
        media = (Math.round(media * 100) / 100).toFixed(2)
        expect(response.text).toMatch(new RegExp(`Média: ${media}`))
      })

      it('should not return a warning', () => {
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
      })
    })

    describe('and both are negative', () => {
      const number1 = -1 * (Math.random() * 10_000)
      const number2 = -1 * (Math.random() * 10_000)
      let response

      beforeEach(async () => {
        response = await request(app)
          .get(`${URL}?number1=${number1}&number2=${number2}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address with the media', () => {
        let media = (number1 + number2) / 2
        media = (Math.round(media * 100) / 100).toFixed(2)
        expect(Number(media)).toBeLessThan(0)
        expect(response.text).toMatch(new RegExp(`Média: ${media}`))
      })

      it('should not return a warning', () => {
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
      })
    })

    describe('and both are positive', () => {
      const number1 = Math.random() * 10_000
      const number2 = Math.random() * 10_000
      let response

      beforeEach(async () => {
        response = await request(app)
          .get(`${URL}?number1=${number1}&number2=${number2}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should return the address with the media', () => {
        let media = (number1 + number2) / 2
        media = (Math.round(media * 100) / 100).toFixed(2)
        expect(Number(media)).toBeGreaterThan(0)
        expect(response.text).toMatch(new RegExp(`Média: ${media}`))
      })

      it('should not return a warning', () => {
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
        expect(response.text).not.toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
      })
    })
  })

  describe('when there only one number', () => {
    describe('and the first field is empty', () => {
      let response

      beforeEach(async () => {
        const number2 = Math.random() * 10_000

        response = await request(app)
          .get(`${URL}?number2=${number2}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should not return the address with the media', () => {
        expect(response.text).not.toMatch(new RegExp(/Média:/))
      })

      it('should return a warning', () => {
        expect(response.text).toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
      })
    })

    describe('and the second field is empty', () => {
      let response

      beforeEach(async () => {
        const number1 = Math.random() * 10_000

        response = await request(app)
          .get(`${URL}?number1=${number1}`)
      })

      it('should return the `statusCode 200`', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })

      it('should not return the address with the media', () => {
        expect(response.text).not.toMatch(new RegExp(/Média:/))
      })

      it('should return a warning', () => {
        expect(response.text).toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
      })
    })
  })

  describe('when there is no number', () => {
    let response

    beforeEach(async () => {
      response = await request(app)
        .get(`${URL}`)
    })

    it('should return the `statusCode 200`', () => {
      expect(response).toHaveProperty('statusCode', 200)
    })

    it('should not return the address with the media', () => {
      expect(response.text).not.toMatch(new RegExp(/Média:/))
    })

    it('should not return a warning', () => {
      expect(response.text).not.toMatch(new RegExp(/Informe um número válido no PRIMEIRO campo!/))
      expect(response.text).not.toMatch(new RegExp(/Informe um número válido no SEGUNDO campo!/))
    })
  })
})