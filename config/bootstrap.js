/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)

  if (await Event.count() > 0) {
    return done();
  }

  await Event.createEach([
    {
      name: 'Singing Contest',
      shortInfo: '一年一度既HKBU Singing Contest又到喇！身為浸大人既你點可能錯過！？無論你係咩系、Bechelor/AD Programme，我地都歡迎你報名！身邊有唱得之人就更係要推薦佢黎喇！',
      fullInfo: '一年一度既HKBU Singing Contest又到喇！身為浸大人既你點可能錯過！？無論你係咩系、Bechelor/AD Programme，我地都歡迎你報名！身邊有唱得之人就更係要推薦佢黎喇！詳情可閱Poster或去到報名Counter查詢。',
      imageSrc: 'https://images.cdn3.stockunlimited.net/preview1300/singing-contest-design_1992565.jpg',
      organizer: 'Student Union',
      date: '2018/11/03',
      startTime: '19:00', endTime: '21:30',
      venue: 'AC Hall',
      quota: 500,
      box: 'highlighted',
      id: 1
    },
  ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
