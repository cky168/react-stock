const axios = require('axios');
const cheerio = require('cheerio');
const fs=require ('fs');

module.exports = (app) => {
    var stockss=[]
    var numAry =''

    app.get(`/api/getall`, async (req, res) => {
      //let products = await Product.find();
      //return res.status(200).send(products);
             
        fs.readFile('./stocklist.json', (err, data) => {
            if (err) throw err
            numAry = JSON.parse(data)
        }); 

        stockss=[];
        for(let i = 0;i< numAry.length;i++){
            const response = await axios.get('http://www.aastocks.com/tc/LTP/RTPopUpQuote.aspx?symbol='+numAry[i].symbol).then((response)=>{
                const $ = cheerio.load(response.data);
                let tmpnum=numAry[i].symbol
                let tmpshare=numAry[i].share
                let tmpprice=numAry[i].price

                $('#divLatestQuote table tbody tr').each(function(i, elem) {
                    let tmp=$(this).text().trim().split('\n');
                    if(tmp[0]!=="名稱"){
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
        return res.status(200).send(stockss)
    })

    //app.post(`/api/product`, async (req, res) => {
      //let product = await Product.create(req.body);
     // return res.status(201).send({
       // error: false,
      //  product
     // })
    //})


  
  //  app.put(`/api/product/:id`, async (req, res) => {
  //    const {id} = req.params;
  
  //    let product = await Product.findByIdAndUpdate(id, req.body);
  
 //     return res.status(202).send({
 //       error: false,
 //       product
 //     })
  
 //   });
  
  //  app.delete(`/api/product/:id`, async (req, res) => {
    //  const {id} = req.params;
  
   //   let product = await Product.findByIdAndDelete(id);
  
   //   return res.status(202).send({
   //     error: false,
   //     product
   //   })
  
  //  })
  
  }


  /*
        const promisify = require('util').promisify;
        let initjason=[
         {
            "symbol":"9988",
            "mode": "buy",
            "share": "100@200",
            "price": "200@201"
        },
        {
            "symbol":"6060", 
            "mode": "history",
            "share": "",
            "price": ""
        }
        ];
        let jdata=JSON.stringify(initjason,null,2);
        fs.writeFile('./stocklist.json', jdata, (err) => {
        if (err) throw err;
        console.log('Data written to file');
        });
        */