exports.addProduct = (db) => (req, res) => {
    const {
        devicename,
        email,
        condition,
        priceusd,
        description,
        quantity,
        photo
    } = req.body;
    if (!devicename || !email || !condition || !priceusd || !description || !quantity) {
        return res.json('something wrong with wrote informations')
    }
    db('products').insert({
        devicename: devicename,
        email,
        condition,
        priceusd: priceusd,
        description,
        quantity: quantity,
        photo: photo
    }).then(response => {
        db('products').select('*').then(resp => {
            res.json(resp)
        })
    }).catch(err => {
        res.json(err)
    })
}

exports.getProducts = (db) => (req, res, next) => {
    db.select('*').from('products').then(result => {
        res.json(result)
    }).catch(err => {
        res.json(err)
    })
}