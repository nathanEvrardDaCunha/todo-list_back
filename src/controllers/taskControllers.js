import { HTTP_SUCCESS_CODE } from '../constants/http-constants.js';

// Will probably need to redo the Task in the DB to be in sync with my frontend for future features.

async function postTask(req, res, next) {
    try {
        const { title, description, project, deadline } = req.body;

        res.status(HTTP_SUCCESS_CODE.CREATED).json({
            status: 'success',
            message:
                'Temporary route to test if task creation is received properly',
            temporary: {
                title: title,
                description: description,
                project: project,
                deadline: deadline,
            },
        });
    } catch (error) {
        next(error);
    }
}

export { postTask };
