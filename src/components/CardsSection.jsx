import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import LeafletMap from './leaflet/LeafletMap';
import GoogleMap from './google/GoogleMap';

const CardsSection = ({ darkMode }) => {
  const cardStyle = darkMode ? { background: '#222', color: '#fff' } : {};

  return (
    <Row>
      <Col md="6">
        <Card style={cardStyle} className="shadow-sm mb-4">
          <CardBody>
            <LeafletMap />
          </CardBody>
        </Card>
      </Col>
      <Col md="6">
        <Card style={cardStyle} className="shadow-sm mb-4">
          <CardBody>
            <GoogleMap />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CardsSection;
