import React from "react";

const ResponsiveGridWithMap = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50">
      <div className="rounded-lg overflow-hidden">
        <div
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            width: "100%",
            height: "250px",
          }}
        >
          <div
            id="google-maps-display"
            style={{ height: "100%", width: "100%", maxWidth: "100%" }}
          >
            <iframe
              title="Google Map"
              style={{ height: "100%", width: "100%", border: 0 }}
              allowFullScreen
              src="https://www.google.com/maps/embed/v1/place?q=2-34+Bunker+Road,+Victoria+Point,+QLD+4165&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            ></iframe>
            
          </div>
        </div>
        <p className="text-center font-bold mt-4">
              2-34 Bunker Road, Victoria Point, QLD 4165
            </p>
      </div>

      <div className="rounded overflow-hidden">
        <div
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            width: "100%",
            height: "250px",
          }}
        >
          <div
            id="google-maps-display"
            style={{ height: "100%", width: "100%", maxWidth: "100%" }}
          >
            <iframe
              title="Google Map"
              style={{ height: "100%", width: "100%", border: 0 }}
              allowFullScreen
              src="https://www.google.com/maps/embed/v1/search?q=22+Zenit+St,+Rochedale,+QLD+4123&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            ></iframe>
           
          </div>
        </div>
         <p className="text-center font-bold mt-4">
              22 Zenit St, Rochedale, QLD 4123
            </p>
      </div>
      <div className="rounded overflow-hidden">
        <div
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            width: "100%",
            height: "250px",
          }}
        >
          <div
            id="google-maps-display"
            style={{ height: "100%", width: "100%", maxWidth: "100%" }}
          >
            <iframe
              title="Google Map"
              style={{ height: "100%", width: "100%", border: 0 }}
              allowFullScreen
              src="https://www.google.com/maps/embed/v1/search?q=48-50+Grevillea+Street,+Biloela,+QLD+4715&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            ></iframe>
          
          </div>
        </div>
          <p className="text-center font-bold mt-4">
              48-50 Grevillea Street, Biloela, QLD 4715
            </p>
      </div>
      <div className="rounded overflow-hidden">
        <div
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            width: "100%",
            height: "250px",
          }}
        >
          <div
            id="google-maps-display"
            style={{ height: "100%", width: "100%", maxWidth: "100%" }}
          >
            <iframe
              title="Google Map"
              style={{ height: "100%", width: "100%", border: 0 }}
              allowFullScreen
              src="https://www.google.com/maps/embed/v1/place?q=8+Charm+Street,+PalmView, QLD 4553&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            ></iframe>
          </div>
        </div>
        <p className="text-center font-bold mt-4">
          8 Charm Street, PalmView, QLD 4553
        </p>
      </div>
    </div>
  );
};

export default ResponsiveGridWithMap;
