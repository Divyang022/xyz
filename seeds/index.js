const mongoose = require('mongoose');
const Job = require('../models/jobs');
const cities = require('./cities');
const jobii = require('./job');

mongoose.connect('mongodb://0.0.0.0:27017/job-seeker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database Connected');
})
    .catch((err) => {
        console.log(err, 'This is the error');
    })
mongoose.set('strictQuery', true);

const seed = async () => {
    await Job.deleteMany({});
    const random100 = Math.floor(Math.random() * 100);
    for (let i = 0; i < 4; i++) {
        const job = new Job({
            name: `${jobii[i].name}`,
            salary: `${jobii[i].salary}`,
            image: `${jobii[i].image}`,
            wfh: `${jobii[i].wfh}`,
            full_time: `${jobii[i].full_time}`,
            part_time: `${jobii[i].part_time}`,
            location: `${cities[random100].city}, ${cities[random100].admin_name}`,
            domain: 'Software Engineer',
        })
        await job.save();
    }
}

seed();
