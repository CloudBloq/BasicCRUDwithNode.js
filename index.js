const express = require('express');
const mongoose = require('mongoose');
const mongoDbUrl = 'mongodb://localhost/BankAccount';
const Account = require('../BankAccount/models/Account');
const { v4: uuidv4 } = require('uuid');

const app = express();
mongoose.connect(mongoDbUrl, { useUnifiedTopology: true }, { useNewUrlParser: true });
const con = mongoose.connection;

con.on('open', function(){
    console.log('Db connected');
});
app.use(express.json());

//Get all accounts
app.get('/', async(req, res) =>{
    const allAccounts = await Account.find(); 
    res.json(allAccounts)
});

//Get all Accounts
app.get('/api/accounts', async(req, res) => {
    const allAccounts = await Account.find(); 
    res.json(allAccounts)
});

//Get an Account by id
app.get('/api/accounts/:id', async(req, res) => {
    try {
        const account = await Account.findById(req.params.id); 

    //Return 404 if account doesn't exit
    if(!account){
        res.status(404).send(`Account with id: ${req.params.id} not found`);
        return;
    }
    res.json(account)
    } catch (error) {
        res.send(`Error ${error}`);
    }
    
});

//Add a new Account 
app.post('/api/accounts', async(req, res) => {
    const account = new Account({  
        id: uuidv4(),     
        name: req.body.name,
        balance: req.body.balance
    });

    try {
        const savedAccount = await account.save();
        res.json(savedAccount);
    } catch (error) {
        res.send(`Error ${error}`);
    }   
});

//Update the details of an Account
app.put('/api/accounts/:id', async(req, res) => {
    try {
        const account = await Account.findById(req.params.id); 

        //Return 404 if account doesn't exit
        if(!account){
            res.status(404).send(`Account with id: ${req.params.id} not found`);
            return;
        }
   
        //Update the account
        account.id = uuidv4();
        account.balance = req.body.balance;
        account.name = req.body.name;

        const savesAccount = await account.save()

        res.json(savesAccount);
    } catch (error) {
        res.send(`Error ${error}`);
    }
});

//Delete an Account  
app.delete('/api/accounts/:id', async(req, res) =>{
    try {
        const account = await Account.findById(req.params.id); 

        //Return 404 if account doesn't exit
        if(!account){
            res.status(404).send(`Account with id: ${req.params.id} not found`);
            return;
        }
        await account.remove();
        res.send("Account has been deleted successfully");
        return;
    } catch (error) {
        res.send(`Error ${error}`);
    }    
});


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));