import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { useState, useEffect,useRef } from "react";
//import stockService from './services/stockService';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table} from 'react-bootstrap';
//import axios from 'axios';

function App() {
  
  const [products, setproducts] = useState();
  const [qtime, setqtime] = useState(new Date());
  const [delay, setDelay] = useState(5000);
  const [isRunning, setIsRunning] = useState(true);
  //useEffect(() => {
 //   if(!products) {
 //     getProducts();    
 //   }
 // },[])

  useInterval(() => {
    // Your custom logic here
    getProducts();
  }, isRunning ? delay : null);

  const getProducts = async () => {
    //setproducts(null);
    //let res=await fetch(`/api/bitcoin?idd=btc-usd`);
try{
    let res=await fetch(`/api/getall`)
    let data=await res.json()
    //console.log(data)
    setproducts(data);
    setqtime(new Date());

  } catch (error) {
    setIsRunning(false);
    console.log("fuck:"+error);
}

  };

  
  function useInterval(callback, delay) {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let timeid  = setInterval(tick, delay);
        return () => clearInterval(timeid);
      }
    }, [delay]);
  };

  function handleDelayChange(e) {
    setDelay(Number(e.target.value));
  };

  function handleIsRunningChange(e) {
    setIsRunning(e.target.checked);
  };
  
  const renderProduct = product => {
    return (
      <tr key={product[3]}>
        <td>{product[3]}</td>
        <td>{product[0]}</td>
        <td>{product[1]}</td>
        <td><font color={ product[2].includes("-") === true
                ? 'red':'black'}>{product[2]}</font>
        </td>    
        <td><font color={ product[4] < 0 
                ? 'red':'black'}>{product[4]}</font>
        </td>
      </tr>
    );
  };
  qtime.toString()
  return (
    <div className="App">
    <Table bordered hover style={{fontSize:12}}> 
      <tbody>
      {(products && products.length > 0) ? (
          products.map(product => renderProduct(product))
        ) : (
           <tr></tr>
        )
      }
      <tr><td colSpan="5">
       {(products && products.length > 0) ? (
          qtime.toString()
        ) : (
           ""
        )
      }
      </td></tr>
      </tbody>
    </Table>
      <input type="checkbox" checked={isRunning} onChange={handleIsRunningChange} /> start | Reflesh time: 
	  <input value={delay} onChange={handleDelayChange} />
      </div>
  );

  
}

export default App;
