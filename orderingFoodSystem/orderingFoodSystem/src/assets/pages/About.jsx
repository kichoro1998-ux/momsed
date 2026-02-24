import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      {/* OUR STORY */}
      <section className="py-5 mt-5" id="OurStory">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 fade-in-up">
              <h2 className="fw-bold">Our Story</h2>
              <p className="mt-3">
                Founded in 2020, QuickBites has quickly become the go-to online food ordering system in the city. 
                Our mission is to bring your favorite meals from local restaurants directly to your doorstep, fast and fresh.
              </p>
              <p>
                We believe that ordering food should be simple, enjoyable, and reliable. Whether you're craving a quick snack or a full meal, 
                QuickBites makes sure your favorites are just a few clicks away.
              </p>
            </div>
            <div className="col-lg-6 fade-in-up" style={{ animationDelay: '.3s' }}>
              <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Our Story" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-light py-5">
        <div className="container-fluid text-center">
          <h2 className="fw-bold fade-in-up">Mission & Vision</h2>
          <div className="row mt-4 g-4">
            <div className="col-md-6 fade-in-up">
              <div className="p-4 bg-white rounded shadow h-100">
                <i className="fa-solid fa-bullseye fa-3x mb-3" style={{ color: '#e53935' }}></i>
                <h5>Mission</h5>
                <p>
                  To provide fast, reliable, and tasty food delivery from your favorite restaurants, making mealtime simple and enjoyable.
                </p>
              </div>
            </div>
            <div className="col-md-6 fade-in-up" style={{ animationDelay: '.2s' }}>
              <div className="p-4 bg-white rounded shadow h-100">
                <i className="fa-solid fa-eye fa-3x mb-3" style={{ color: '#e53935' }}></i>
                <h5>Vision</h5>
                <p>
                  To be the leading online food ordering platform, recognized for quality, convenience, and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL TEAM */}
      <section className="py-5">
        <div className="container-fluid text-center">
          <h2 className="fw-bold fade-in-up">Our Dedicated Team</h2>
          <div className="row mt-4 g-4">
            <div className="col-md-4 fade-in-up">
              <div className="card h-100 shadow">
                <img src="/public/foodpic.jpg" className="card-img-top" alt="Team Member 1" />
                <div className="card-body">
                  <h5 className="card-title">Momse</h5>
                  <p className="card-text">Operations Manager | Ensures fast and accurate deliveries</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 fade-in-up" style={{ animationDelay: '.2s' }}>
              <div className="card h-100 shadow">
                <img src="/public/foodpic.jpg" className="card-img-top" alt="Team Member 2" />
                <div className="card-body">
                  <h5 className="card-title">Jewish</h5>
                  <p className="card-text">Customer Experience Specialist | Handles orders & feedback</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 fade-in-up" style={{ animationDelay: '.4s' }}>
              <div className="card h-100 shadow">
                <img src="/public/foodpic.jpg" className="card-img-top" alt="Team Member 3" />
                <div className="card-body">
                  <h5 className="card-title">Abidal</h5>
                  <p className="card-text">Food Partner Coordinator | Connects with local restaurants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES / DELIVERY STRENGTHS */}
      <section className="bg-light py-5">
        <div className="container-fluid text-center">
          <h2 className="fw-bold fade-in-up">Our Services & Facilities</h2>
          <div className="row mt-4 g-4 fade-in-up">
            <div className="col-md-4">
              <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Fast Delivery" />
              <h5 className="mt-2">Fast & Reliable Delivery</h5>
            </div>
            <div className="col-md-4">
              <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Wide Menu" />
              <h5 className="mt-2">Wide Restaurant & Menu Options</h5>
            </div>
            <div className="col-md-4">
              <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Quality Food" />
              <h5 className="mt-2">Quality Assured Meals</h5>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY / FOOD STANDARDS */}
      <section className="py-5 text-center">
        <div className="container-fluid fade-in-up">
          <h2 className="fw-bold">Food Safety & Standards</h2>
          <p className="mt-3">
            All our partner restaurants follow strict hygiene protocols. Meals are prepared fresh and handled with the highest food safety standards.
          </p>
        </div>
      </section>

      {/* CTA JOIN */}
      <section className="text-center text-light py-5 join-section fade-in-up" style={{ backgroundColor: '#ff5722' }}>
        <div className="container-fluid">
          <h2 className="fw-bold">Hungry? Let’s Get Started!</h2>
          <p className="mt-2">Order your favorite meals in minutes from top restaurants near you.</p>
          <Link to="/menu" className="btn btn-light btn-lg mt-3 px-4">Order Now</Link>
        </div>
      </section>
    </>
  );
}
