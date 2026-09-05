import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: order, isLoading, error, refetch } =
    useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const payOrderHandler = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          id: orderId,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      }).unwrap();
      refetch();
      toast.success('Plaćanje je potvrđeno');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Porudžbina je označena kao isporučena');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Porudžbina {order._id.substring(0, 8)}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Dostava</h2>
              <p>
                <strong>Ime: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Adresa: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Isporučeno {order.deliveredAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Nije isporučeno</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Plaćanje</h2>
              <p>
                <strong>Način: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Plaćeno {order.paidAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Nije plaćeno</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Stavke porudžbine</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x {item.price} RSD = {item.qty * item.price} RSD
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Rezime porudžbine</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Stavke</Col>
                  <Col>{order.itemsPrice} RSD</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Dostava</Col>
                  <Col>{order.shippingPrice} RSD</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Porez</Col>
                  <Col>{order.taxPrice} RSD</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Ukupno</Col>
                  <Col>{order.totalPrice} RSD</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={loadingPay}
                    onClick={payOrderHandler}
                  >
                    Potvrdi plaćanje
                  </Button>
                  {loadingPay && <Loader />}
                </ListGroup.Item>
              )}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={loadingDeliver}
                    onClick={deliverOrderHandler}
                  >
                    Označi kao isporučeno
                  </Button>
                  {loadingDeliver && <Loader />}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
