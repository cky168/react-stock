const axios = require('axios');
const cheerio = require('cheerio');
const fs=require ('fs');
const fetch = require('node-fetch');

module.exports = (app) => {
    var numAry=''
    var stockss=[]
    app.get(`/api/getall`, async (req, res) => {      
        fs.readFile('./stocklist.json', (err, data) => {
            if (err) throw err
            numAry = JSON.parse(data)
        }); 

        stockss=[]
        for(let i = 0;i< numAry.length;i++){
            const response = await axios.get('http://www.aastocks.com/tc/LTP/RTPopUpQuote.aspx?symbol='+numAry[i].symbol).then((response)=>{
                const $ = cheerio.load(response.data);
                let tmpnum=numAry[i].symbol
                let tmpshare=numAry[i].share
                let tmpprice=numAry[i].price
                $('#divLatestQuote table tbody tr').each(function(i, elem) {
                    let tmp=$(this).text().trim().split('\n');
                    if(tmp[0]!=="名稱"){
                        tmp[0]=cleanStr(tmp[0])
                        tmp[1]=cleanStr(tmp[1])
                       // tmp[1]=Math.floor(Math.random() * Math.floor(100))
                        tmp[2]=cleanStr(tmp[2])
                        tmp[3]=tmpnum
                        if(tmpshare!=""){
                            let rlt=Math.trunc((tmp[1]*tmpshare)-(tmpshare*tmpprice))
                            tmp[4]=rlt
                        }
                        stockss.push(tmp)
                    }
                })
            }) 
        }
       // console.log(stockss)
        const obj1=JSON.stringify(stockss)
        return res.status(200).send(obj1)
    });

    function cleanStr(str) {
        while (str.indexOf("\t") > -1) { str = str.replace("\t", "") }
        while (str.indexOf("  ") > -1) { str = str.replace("  ", "") }
        return str
    };
  
   app.get(`/api/bitcoin`, async (req, res) => {
        let coinrlt=[]
        const response = await fetch('https://hk.investing.com/crypto/bitcoin/'+req.query.idd)
        .then(res=>res.text())
        const $ = cheerio.load(response)
             $('#last_last').each(function(i, elem) {
                let tmp=$(this).text().trim().split('\n')
                tmp[1]=req.query.idd
                coinrlt.push(tmp)
             })
       // const json = '{"result":true, "count":42}';
       // const obj = JSON.parse(json);
        const obj2=JSON.stringify(coinrlt)
        return res.status(202).send(obj2)
    });



   // app.get(`/api/getall`, async (req, res) => {
        //let products = await Product.find();
        //return res.status(200).send(products); 
    //});

   // app.put(`/api/product/:id`, async (req, res) => {
    //    const {id} = req.params;
         //    let product = await Product.findByIdAndUpdate(id, req.body);
   //      return res.status(202).send({stockss})
  //  });

  //  app.delete(`/api/product/:id`, async (req, res) => {
    //  const {id} = req.params;
   //   let product = await Product.findByIdAndDelete(id);
   //   return res.status(202).send({
   //     error: false,
   //     product
   //   })
  //  });
  
  }


