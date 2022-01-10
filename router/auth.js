const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch")
const apiKey = process.env.TMDB_API_KEY

// modules import
require("../db/conn")
const Credential = require("../model/credentialSchema")

router.get('/', (req, res) => {
    res.send("working succesfully")
});

router.post('/search', (req, res) => {
    try{
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${req.body.search}`)
        .then(data => data.json())
        .then(data => {
            res.send(data.results)
        })
    }catch(e){
        console.log(e)
    }
});

router.post('/movie', (req, res) => {
    try{
        fetch(`https://api.themoviedb.org/3/movie/${req.body.id}?api_key=${apiKey}`)
        .then(data => data.json())
        .then(data => {
            res.send(data)
        })
    }catch(e){
        console.log(e.message)
    }
});

router.get('/trending', (req,res) => {
    try{
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
        .then(data => data.json())
        .then(data => {
            res.send(data.results)
        })
    }catch(e){
        console.log(e.message)
    }
})

router.get('/requesttoken',(req,res)=>{
    try{
        fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
        .then(data => data.json())
        .then(data => {
            res.send(data)
        })
    }catch(e){
        console.log(e.message)
    }
})

router.post('/sessionid',(req,res)=>{
    try{
        fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`,{
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"request_token": req.body.request_token})
        })
        .then(data => data.json())
        .then(data => {
            res.send(data)
        })
    }catch(e){
        console.log(e.message)
    }
})

router.post('/updatesession',(req,res)=>{
    try{
        fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`,{
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"request_token": req.body.request_token})
        })
        .then(data => data.json())
        .then(data => {
            const filter = { user: 'root' };
            const update = { session_id : data.session_id };
            Credential.findOneAndUpdate(filter, update)
            .then(() => {
                res.send({message:"successful"})
            })
        })
    }catch(e){
        console.log(e.message)
    }
    
})

router.post('/addwatched', (req, res) => {
    const filter = { user: 'root' };
    Credential.findOne(filter)
    .then((result) => {
        try{
            fetch(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${result.session_id}`)
            .then(data => data.json())
            .then(data => {
                fetch(`https://api.themoviedb.org/3/account/${data.username}/watchlist?api_key=${apiKey}&session_id=${result.session_id}`,{
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        media_type: "movie",
                        media_id: req.body.id,
                        watchlist: true
                    })
                }).then((data) => {
                    console.log(req.body.id)
                })
            })
        }catch(e){
            console.log(e.message)
        }
    })
    
})

router.post('/removewatched', (req, res) => {
    const filter = { user: 'root' };
    Credential.findOne(filter)
    .then((result) => {
        try{
            fetch(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${result.session_id}`)
            .then(data => data.json())
            .then(data => {
                fetch(`https://api.themoviedb.org/3/account/${data.username}/watchlist?api_key=${apiKey}&session_id=${result.session_id}`,{
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        media_type: "movie",
                        media_id: req.body.id,
                        watchlist: false
                    })
                }).then((data) => {
                    console.log(req.body.id)
                })
            })
        }catch(e){
            console.log(e.message)
        }
    })
    
})


router.get('/watchlist', (req,res) => {
    const filter = { user: 'root' };
    Credential.findOne(filter)
    .then((result) => {
        try{
            fetch(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${result.session_id}`)
            .then(data => data.json())
            .then( data => {
                fetch(`https://api.themoviedb.org/3/account/${data.username}/watchlist/movies?api_key=${apiKey}&session_id=${result.session_id}`)
                .then(data => data.json())
                .then(data => {
                    res.send(data.results)
                })
            })
        }catch(e){
            console.log(e.message)
        }
    })
})

router.get('/account', (req, res) => {
    const filter = { user: 'root' };
    Credential.findOne(filter)
    .then((result) => {
        try{
            fetch(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${result.session_id}`)
            .then(data => data.json())
            .then(data => {
                res.send(data.username)
            })
        }catch(e){
            console.log(e.message)
        }
    })
})


module.exports = router;