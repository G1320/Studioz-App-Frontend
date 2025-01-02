import { useUserContext } from '@contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const { state } = useLocation();
  const { user } = useUserContext();

  const navigate = useNavigate();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('he-IL');
  };

  const orderData = state?.orderData;

  if (!orderData) {
    return (
      <div className="order-success">
        <h1>Order Not Found</h1>
        <p>We couldn't find details for this order.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }
  return (
    <div className="order-success-container">
      <div className="container">
        <div className="header">
          <h1>Success! </h1>
          <p>Thank you for your purchase!</p>
        </div>

        <div className="content">
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value">{orderData.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Customer Name:</span>
              <span className="value">{user?.name || orderData.payer.name.given_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email || orderData.payer.email_address}</span>
            </div>
            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">{formatDate(orderData.create_time)}</span>
            </div>

            {/* Add items section */}
            <div className="items-section">
              <h3>Items</h3>
              <div className="items-table">
                <div className="table-header">
                  <div className="col">Item</div>
                  <div className="col">Quantity</div>
                  <div className="col">Price</div>
                  <div className="col">Total</div>
                </div>
                {orderData.purchase_units[0].items.map((item: any, index: number) => {
                  const itemTotal = parseFloat(item.unit_amount.value) * parseInt(item.quantity);
                  return (
                    <div key={index} className="table-row">
                      <div className="col" data-label="Item">
                        {item.name}
                      </div>
                      <div className="col" data-label="Quantity">
                        {item.quantity}
                      </div>
                      <div className="col" data-label="Price">
                        ₪{item.unit_amount.value}
                      </div>
                      <div className="col" data-label="Total">
                        ₪{itemTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="total-amount">Total Amount: ₪{orderData.purchase_units[0].amount.value}</div>
          </div>

          <div className="button-group">
            <button onClick={() => navigate('/')}>Return to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
