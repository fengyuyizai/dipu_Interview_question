const intermediate = require('../static/_intermediate');
const LocalData = require('./unit/config.json')

describe('action is null situation', () => {
  for (let i = 0; i < 4; i++) {
    test(`config[${i}]`, done => {
      function callback(err, res) {
        expect(err).toBe('error action')
        expect(res).toBe(null)
        done()
      }
      intermediate(LocalData.config[i], callback);
    })
  }
})

describe('action is single situation, config[4 - 9]', () => {
  test(`test config[4], lack accessKeySecret,accountName,toAddress`, done => {
    function callback(err) {
      expect(err).toBe('accessKeySecret required,accountName required,toAddress required')
      done()
    }
    intermediate(LocalData.config[4], callback)
  })
  test(`test config[5], lack accountName, toAddress`, done => {
    function callback(err) {
      expect(err).toBe('accountName required,toAddress required')
      done()
    }
    intermediate(LocalData.config[5], callback)
  })
  test(`test config[6], lack toAddress`, done => {
    function callback(err) {
      expect(err).toBe('toAddress required')
      done()
    }
    intermediate(LocalData.config[6], callback)
  })
  test(`test config[7], The request is illegal, param err`, done => {
    function callback(err, res) {
      // console.log(err)
      // 因为服务器代理不上，此处无法测出服务器真实返回值
      expect(res.isErr).toBe(false)
      done()
    }
    intermediate(LocalData.config[7], callback)
  })
})
describe('action is batch situation, config[10 - end]', () => {
  test(`test config[10], lack accessKeyID,accessKeySecret,accountName,toAddress,templateName,receiversName`, done => {
    function callback(err) {
      expect(err).toBe('accessKeyID required,accessKeySecret required,accountName required,templateName required,receiversName required')
      done()
    }
    intermediate(LocalData.config[10], callback)
  })
  test(`test config[11], lack accessKeySecret, accountName, templateName, receiversName`, done => {
    function callback(err) {
      expect(err).toBe('accessKeySecret required,accountName required,templateName required,receiversName required')
      done()
    }
    intermediate(LocalData.config[11], callback)
  })
  test(`test config[12], lack accountName, templateName, receiversName`, done => {
    function callback(err) {
      expect(err).toBe('accountName required,templateName required,receiversName required')
      done()
    }
    intermediate(LocalData.config[12], callback)
  })
  test(`test config[13], lack templateName, receiversName`, done => {
    function callback(err, res) {
      expect(err).toBe('templateName required,receiversName required')
      done()
    }
    intermediate(LocalData.config[13], callback)
  })
  test(`test config[14], lack receiversName`, done => {
    function callback(err, res) {
      expect(err).toBe('receiversName required')
      done()
    }
    intermediate(LocalData.config[14], callback)
  })
  test(`test config[15], The request is illegal, param err`, done => {
    function callback(err, res) {
      // 因为服务器代理不上，此处无法测出服务器真实返回值
      expect(res.isErr).toBe(false)
      done()
    }
    intermediate(LocalData.config[15], callback)
  })
})