exports.getFeedbacks = (db) => (req, res) => {
    db('feedbacks').select('*').then(response => {
        res.json(response)
    }).catch(err => {
        res.json(err)
    })
}

exports.insertFeedback = (db) => (req, res) => {
    const {
        name,
        feedback
    } = req.body;
    if (!name || !feedback) {
        return res.json('name and feedback should not be empty')
    }
    if (typeof name !== 'string') {
        return res.json('write proper name')
    }

    if (name.trim() === '' || feedback.trim() === '') {
        return res.json('name and feedback should not be empty')
    }
    db('feedbacks').insert({
        name,
        feedback
    }).then(response => {
        db('feedbacks').select('*').then(response => {
            res.json(response)
        })
    }).catch(err => {
        res.json(err)
    })
}