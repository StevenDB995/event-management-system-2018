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
      name: 'International Festival',
      shortInfo: 'The International Festival is an event which HKBU holds on campus every October. The Festival presents a national costume parade, variety show, food, talks, exhibitions, workshops and many more...',
      fullInfo: 'The International Festival is an event which HKBU holds on campus every October. The Festival presents a national costume parade, variety show, food, talks, exhibitions, workshops and many more... Click the URL to view the details of this programme: https://intl.hkbu.edu.hk/f/upload/1021/Intl_Fest_2018.pdf',
      imageSrc: 'https://intl.hkbu.edu.hk/f/event/1367/Poster_430x597_B03c.jpg',
      organizer: 'Student Affairs',
      date: '2018/10/23',
      startTime: '09:00', endTime: '21:00',
      venue: 'HKBU Campus',
      box: 'highlighted',
      id: 1
    },

    {
      name: 'Singing Contest',
      shortInfo: '一年一度既HKBU Singing Contest又到喇！身為浸大人既你點可能錯過！？無論你係咩系、Bechelor/AD Programme，我地都歡迎你報名！身邊有唱得之人就更係要推薦佢黎喇！',
      fullInfo: '一年一度既HKBU Singing Contest又到喇！身為浸大人既你點可能錯過！？無論你係咩系、Bechelor/AD Programme，我地都歡迎你報名！身邊有唱得之人就更係要推薦佢黎喇！詳情可閱Poster或去到報名Counter查詢。',
      imageSrc: 'https://images.cdn3.stockunlimited.net/preview1300/singing-contest-design_1992565.jpg',
      organizer: 'Student Union',
      date: '2018/11/03',
      startTime: '19:00', endTime: '21:30',
      venue: 'AC Hall',
      quota: '500',
      box: 'highlighted',
      id: 2
    },

    {
      name: 'ABCDEFGHIJKLMN',
      shortInfo: 'Learn English and have some fun!',
      fullInfo: 'Learn English and have some fun! Check the poster for more information.',
      imageSrc: 'http://via.placeholder.com/430x597/dec.png',
      organizer: 'Language Centre',
      date: '2018/11/15',
      startTime: '18:30', endTime: '21:30',
      venue: 'RRS401',
      quota: '90',
      box: 'highlighted',
      id: 3
    },

    {
      name: 'Real Craftmanship',
      shortInfo: "Have an idea of real craftmanship? Join us and you'll learn some!",
      imageSrc: 'http://via.placeholder.com/430x597/dec.png',
      date: '2018/11/17',
      organizer: "Academy of Visual Arts",
      startTime: '13:30', endTime: '17:30',
      venue: 'CVA112',
      quota: '40',
      box: 'highlighted',
      id: 4
    },

    {
      name: '3 Points Contest',
      shortInfo: 'Come and be the best 3 points shooter here! Every basketball lovers are welcomed!',
      fullinfo: 'Come and be the best 3 points shooter here! Every basketball lovers are welcomed! Scan the QR code for enrollment.',
      imageSrc: 'http://via.placeholder.com/430x597/dec.png',
      date: '2018/11/21',
      organizer: "UASE",
      startTime: '14:30', endTime: '16:00',
      venue: 'RRS401',
      quota: '32',
      box: '',
      id: 5
    },

    {
      name: 'asdfg1234',
      shortInfo: 'qwerty uiop asdfghjk',
      fullInfo:'kkkij lmnhhg @#$%^&*><?+=...',
      imageSrc: 'http://via.placeholder.com/430x597/dec.png',
      organizer: "Student Affairs",
      date: '2018/11/23',
      startTime: '15:00', endTime: '18:00',
      venue: 'AAB201',
      quota: '180',
      box: 'highlighted',
      id: 6
    }
  ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
