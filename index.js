const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const accountArray = [
    {id: 1, Name: 'John', Balance: 500.00},
    {id: 2, Name: 'Hakem', Balance: 300.50},
    {id: 3, Name: 'Sandra', Balance: 259.00},
    {id: 4, Name: 'Blessing', Balance: 730.99},
    {id: 5, Name: 'Bolu', Balance: 199.99}
];

//Get all accounts
app.get('/', (req, res) =>{
    res.send(accountArray);
});

//Get all Accounts
app.get('/api/accounts', (req, res) => {
    res.send(accountArray);
});

//Get an Account by id
app.get('/api/accounts/:id', (req, res) => {
    const account = accountArray.find(c => c.id == parseInt(req.params.id));
    if(!account){
        res.status(404).send(`Account with id: ${req.params.id} not found`);
        return;
    }
    res.send(account);
});

//Add a new Account 
app.post('/api/accounts', (req, res) => {
    const scheme = {
        Name: Joi.string().required(),        
        Balance: Joi.number().required()
    };

    const result = Joi.validate(req.body, scheme);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }   

    const account = {
        id: accountArray.length + 1,
        Name: req.body.Name,
        Balance: req.body.Balance
    };
    accountArray.push(account);
    res.send(account);
});

//Update the details of an Account
app.put('/api/accounts/:id', (req, res) => {
    const account = accountArray.find(c => c.id == parseInt(req.params.id));

    //Return 404 if account doesn't exit
    if(!account){
        res.status(404).send(`Account with id: ${req.params.id} not found`);
        return;
    }

    const scheme = {       
        Name: Joi.string().required(),        
        Balance: Joi.number().required()
    };

    const result = Joi.validate(req.body, scheme);

    //Return 400 if validation fails
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }   

    //Update the account
    account.Balance = req.body.Balance;
    account.Name = req.body.Name;
    res.send(account);
});

//Delete an Account  
app.delete('/api/accounts/:id', (req, res) =>{
    const account = accountArray.find(c => c.id == parseInt(req.params.id));

    //Return 404 if account doesn't exit
    if(!account){
        res.status(404).send(`Account with id: ${req.params.id} not found`);
        return;
    }

    //Delete the account
    const index = accountArray.indexOf(account);
    accountArray.splice(index, 1);

    res.send("Account has been deleted successfully");
});


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));