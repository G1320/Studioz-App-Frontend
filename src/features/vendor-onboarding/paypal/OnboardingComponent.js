import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VendorRegistration = ({ paymentProvider }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessId: '',
    bankName: '',
    branchNumber: '',
    accountNumber: '',
    expectedVolume: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${paymentProvider}/register-vendor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Handle success
      alert('Registration submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vendor Registration - {paymentProvider}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="">
          <div className="">
            <div>
              <label className="">Business Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="" required />
            </div>

            <div>
              <label className="">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="" required />
            </div>

            <div>
              <label className="">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="" required />
            </div>

            <div>
              <label className="">Business ID (מספר עוסק)</label>
              <input
                type="text"
                name="businessId"
                value={formData.businessId}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            <div>
              <label className="">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            <div>
              <label className="">Branch Number</label>
              <input
                type="text"
                name="branchNumber"
                value={formData.branchNumber}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            <div>
              <label className="">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className=""
                required
              />
            </div>

            <div>
              <label className="">Expected Monthly Volume (ILS)</label>
              <input
                type="number"
                name="expectedVolume"
                value={formData.expectedVolume}
                onChange={handleChange}
                className=""
                required
              />
            </div>
          </div>

          {error && <div className="">{error}</div>}

          <div className="mt-6">
            <button type="submit" disabled={loading} className="">
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorRegistration;
