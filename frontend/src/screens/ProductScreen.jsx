import { useState } from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';

import {

  Form,

  Row,

  Col,

  Image,

  Card,

  Button,

  Badge,

  ListGroup,

} from 'react-bootstrap';

import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';

import {

  useGetProductDetailsQuery,

  useCreateReviewMutation,

} from '../slices/productApiSlice';

import Rating from '../components/Rating';

import Loader from '../components/Loader';

import Message from '../components/Message';

import { useDispatch } from 'react-redux';

import { addToCart } from '../slices/cartSlice';



const ProductScreen = () => {

  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');



  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);



  const { data: product, isLoading, error, refetch } =

    useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingReview }] =

    useCreateReviewMutation();



  const addToCartHandler = () => {

    dispatch(addToCart({ ...product, qty }));

    navigate('/cart');

  };



  const submitHandler = async (e) => {

    e.preventDefault();



    try {

      await createReview({

        productId,

        rating,

        comment,

      }).unwrap();

      refetch();

      setRating(0);

      setComment('');

      toast.success('Recenzija je dodata');

    } catch (err) {

      toast.error(err?.data?.message || err.error);

    }

  };



  return (

    <>

      <Link className="btn btn-outline-secondary mb-4" to="/">

        ← Nazad

      </Link>



      {isLoading ? (

        <Loader />

      ) : error ? (

        <Message variant="danger">

          {error?.data?.message || error.error}

        </Message>

      ) : (

        <>

          <Card className="border-0 shadow-sm p-4 mb-4">

            <Row className="align-items-center">

              <Col md={8}>

                <h2 className="mb-2">{product.name}</h2>

                <Rating

                  value={product.rating}

                  text={`${product.numReviews} recenzija`}

                />

              </Col>

              <Col md={4} className="text-md-end mt-3 mt-md-0">

                <h3 className="text-primary mb-0">

                  {product?.price?.toFixed(2)} RSD

                </h3>

              </Col>

            </Row>

          </Card>



          <Row className="gy-4">

            <Col lg={8}>

              <Card className="border-0 shadow-sm p-4">

                <div className="text-center">

                  <Image

                    src={product.image}

                    alt={product.name}

                    fluid

                    style={{ maxHeight: '500px', objectFit: 'contain' }}

                  />

                </div>

              </Card>

            </Col>



            <Col lg={4}>

              <Card className="border-0 shadow-sm">

                <Card.Body>

                  <h4 className="mb-4">Informacije o proizvodu</h4>



                  <div className="d-flex justify-content-between mb-3">

                    <span>Kategorija:</span>

                    <span>{product.category}</span>

                  </div>



                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <span>Status:</span>

                    {product.countInStock > 0 ? (

                      <Badge bg="success">Dostupno</Badge>

                    ) : (

                      <Badge bg="danger">Nije dostupno</Badge>

                    )}

                  </div>



                  {product.countInStock > 0 && (

                    <div className="d-flex justify-content-between align-items-center mb-4">

                      <span>Količina:</span>

                      <Form.Control

                        as="select"

                        value={qty}

                        onChange={(e) => setQty(Number(e.target.value))}

                        style={{ width: '90px', textAlign: 'center' }}

                      >

                        {[...Array(product.countInStock).keys()].map((x) => (

                          <option key={x + 1} value={x + 1}>

                            {x + 1}

                          </option>

                        ))}

                      </Form.Control>

                    </div>

                  )}



                  <div className="d-grid">

                    <Button

                      type="button"

                      disabled={product.countInStock === 0}

                      onClick={addToCartHandler}

                    >

                      Dodaj u korpu

                    </Button>

                  </div>

                </Card.Body>

              </Card>

            </Col>

          </Row>



          <Card className="border-0 shadow-sm mt-4">

            <Card.Body>

              <h4 className="mb-3">Opis proizvoda</h4>

              <p className="text-muted mb-0">{product.description}</p>

            </Card.Body>

          </Card>



          <Row className="mt-4">

            <Col md={6}>

              <h2>Recenzije</h2>

              {product.reviews.length === 0 && <Message>Nema recenzija</Message>}

              <ListGroup variant="flush">

                {product.reviews.map((review) => (

                  <ListGroup.Item key={review._id}>

                    <strong>{review.name}</strong>

                    <Rating value={review.rating} />

                    <p>{review.createdAt.substring(0, 10)}</p>

                    <p>{review.comment}</p>

                  </ListGroup.Item>

                ))}

              </ListGroup>

              <h2>Napišite recenziju</h2>

              {userInfo ? (

                <Form onSubmit={submitHandler}>

                  <Form.Group controlId="rating" className="my-2">

                    <Form.Label>Ocena</Form.Label>

                    <Form.Control

                      as="select"

                      value={rating}

                      onChange={(e) => setRating(e.target.value)}

                    >

                      <option value="">Odaberite...</option>

                      <option value="1">1 - Loše</option>

                      <option value="2">2 - Slabo</option>

                      <option value="3">3 - Dobro</option>

                      <option value="4">4 - Vrlo dobro</option>

                      <option value="5">5 - Odlično</option>

                    </Form.Control>

                  </Form.Group>

                  <Form.Group controlId="comment" className="my-2">

                    <Form.Label>Komentar</Form.Label>

                    <Form.Control

                      as="textarea"

                      rows="3"

                      value={comment}

                      onChange={(e) => setComment(e.target.value)}

                    />

                  </Form.Group>

                  <Button

                    disabled={loadingReview}

                    type="submit"

                    variant="primary"

                  >

                    Pošalji

                  </Button>

                  {loadingReview && <Loader />}

                </Form>

              ) : (

                <Message>

                  Molimo <Link to="/login">prijavite se</Link> da biste napisali

                  recenziju

                </Message>

              )}

            </Col>

          </Row>

        </>

      )}

    </>

  );

};



export default ProductScreen;

