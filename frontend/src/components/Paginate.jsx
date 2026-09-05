import { Pagination } from 'react-bootstrap';

const Paginate = ({ pages, page, keyword, setPageNumber }) => {
  if (pages <= 1) return null;

  return (
    <Pagination className="justify-content-center mt-4">
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          active={x + 1 === page}
          onClick={() => setPageNumber(x + 1)}
        >
          {x + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Paginate;
