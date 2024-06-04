const cron = require('node-cron');
const { Op } = require('sequelize');
const { Project } = require('./models'); // Adjust the path to your models as necessary

// Schedule a job to run every minute
cron.schedule('* * * * *', async () => {
    try {
        const currentDateTime = new Date();
        const projectsToUpdate = await Project.findAll({
            where: {
                status: 'Reserved',
                end_datetime: {
                    [Op.lt]: currentDateTime
                }
            }
        });

        for (let project of projectsToUpdate) {
            project.status = 'Available';
            project.reserved_by = null;
            project.start_datetime = null;
            project.end_datetime = null;
            await project.save();
        }

        console.log(`Updated ${projectsToUpdate.length} projects to Available`);
    } catch (error) {
        console.error('Error updating project statuses:', error);
    }
});
