import React, { useState } from 'react';

import { Row, Col, Form } from 'react-bootstrap';

import Product from '../components/Product';

import Loader from '../components/Loader';

import Message from '../components/Message';

import Paginate from '../components/Paginate';

import { useGetProductsQuery } from '../slices/productApiSlice';



const HomeScreen = () => {

  const [keyword, setKeyword] = useState('');

  const [pageNumber, setPageNumber] = useState(1);



  const { data, isLoading, error } = useGetProductsQuery({

    keyword,

    pageNumber,

  });



  return (

    <>

      <Row className="align-items-center mb-4">

        <Col>

          <h1>Domaći proizvodi gazdinstva Cvejić</h1>

        </Col>
        <div className="hero-blob-decoration hero-blob-decoration--sky" />
        <Col md={4}>

          <Form.Control

            type="text"

            placeholder="Pretraži proizvode..."

            value={keyword}

            onChange={(e) => {

              setKeyword(e.target.value);

              setPageNumber(1);

            }}

          />

        </Col>

      </Row>



      {isLoading ? (

        <Loader />

      ) : error ? (

        <Message variant="danger">

          {error?.data?.message || error.error}

        </Message>

      ) : (

        <>

          <Row>

            {data.products.map((product) => (

              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>

                <Product product={product} />

              </Col>

            ))}

          </Row>

          <Paginate

            pages={data.pages}

            page={data.page}

            keyword={keyword ? keyword : ''}

            setPageNumber={setPageNumber}

          />

        </>

      )}

    </>

  );

};



export default HomeScreen;

