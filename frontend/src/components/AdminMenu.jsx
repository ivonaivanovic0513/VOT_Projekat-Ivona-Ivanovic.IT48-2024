import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';

const AdminMenu = () => {
  return (
    <Nav className="justify-content-center mb-4">
      <LinkContainer to="/admin/productlist">
        <Nav.Link>Proizvodi</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/admin/orderlist">
        <Nav.Link>Porudžbine</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/admin/userlist">
        <Nav.Link>Korisnici</Nav.Link>
      </LinkContainer>
    </Nav>
  );
};

export default AdminMenu;
