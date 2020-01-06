import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { useState, useEffect,useRef } from "react";
import stockService from './services/stockService';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table} from 'react-bootstrap';

function App() {
  
  const [products, setproducts] = useState();
  const [qtime, setqtime] = useState(new Date());

  useEffect(() => {
    if(!products) {
      getProducts();
      //getProducts(); 
    }
  })

  const getProducts = async () => {
    setproducts(null);
    let res = await stockService.getAll();
    setproducts(res);
    setqtime(new Date());
  }

  //useInterval(() => {
 //   getProducts();
//  }, 5000);


  const renderProduct = product => {
    return (
      <tr key={product[3]}>
        <td>{product[3].trim()}</td>
        <td>{product[0].trim()}</td>
        <td>{product[1].trim()}</td>
        <td><font color={ product[2].includes("-") === true
                ? 'red':'black'}>{product[2].trim()}</font>
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
       
      </div>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default App;
