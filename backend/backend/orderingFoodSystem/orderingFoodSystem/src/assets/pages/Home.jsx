import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>

            {/* HERO SECTION */}
            <section className="hero container-fluid d-flex align-items-center text-light">
                <div className="container-fluid text-center">
                    <h1 className="display-2 fw-bold fade-in-up">Delicious Food, Delivered Fast</h1>
                    <p className="lead mt-3 fade-in-up" style={{ animationDelay: '.3s' }}>
                        QuickBites brings your favorite meals from top restaurants straight to your door.
                        Easy ordering, fast delivery, and tasty choices for every craving.
                    </p>
                    <div className="mt-4 fade-in-up d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3" style={{ animationDelay: '.5s' }}>
                        <Link to="/menu" className="btn btn-danger btn-lg px-4">Order Now</Link>
                        <Link to="/about" className="btn btn-outline-light btn-lg px-4">Learn More</Link>
                    </div>
                </div>
            </section>

            <div className="main-content">
                {/* ABOUT SECTION */}
                <section className="py-4 py-lg-5 m-3 m-lg-5" id="About">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-6 fade-in-up">
                                <h2 className="fw-bold">About QuickBites</h2>
                                <p className="mt-3">
                                    QuickBites is your go-to online food ordering system connecting you with local restaurants.
                                    We make it simple to browse menus, customize orders, and get your food delivered hot and fresh.
                                </p>
                                <p>
                                    From fast snacks to full meals, our platform is designed for food lovers who value convenience,
                                    quality, and speed. Enjoy a wide variety of cuisines at your fingertips.
                                </p>
                                <Link to="/about" className="btn btn-danger mt-3">Discover More</Link>
                            </div>
                            <div className="col-lg-6 fade-in-up mt-4 mt-lg-0" style={{ animationDelay: '.3s' }}>
                                <img src="/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Image" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US */}
                <section className="bg-light py-4 py-lg-5">
                    <div className="container-fluid text-center">
                        <h2 className="fw-bold fade-in-up">Why Choose QuickBites</h2>
                        <p className="fade-in-up" style={{ animationDelay: '.2s' }}>We make ordering food fast, reliable, and delicious.</p>
                        <div className="row mt-4 g-3 g-lg-4">
                            <div className="col-12 col-md-4 fade-in-up">
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-bolt fa-3x mb-3" style={{ color: '#e53935' }} />
                                    <h5>Fast Delivery</h5>
                                    <p>Get your food delivered quickly and fresh every time.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '.2s' }}>
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-utensils fa-3x mb-3" style={{ color: '#e53935' }} />
                                    <h5>Wide Menu Options</h5>
                                    <p>Explore a variety of cuisines and dishes from local restaurants.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '.4s' }}>
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-star mb-3" style={{ color: '#e53935' }} />
                                    <h5>Quality Assured</h5>
                                    <p>We partner only with trusted restaurants for the best taste and service.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="py-4 py-lg-5">
                    <div className="container-fluid text-center">
                        <h2 className="fw-bold fade-in-up">Our Features</h2>
                        <div className="row mt-4 g-3 g-lg-4">
                            <div className="col-12 col-md-4 fade-in-up">
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-mobile-screen-button fa-3x mb-3" style={{ color: '#e53935' }} />
                                    <h5>Easy Ordering</h5>
                                    <p>Order your favorite meals in just a few clicks.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '.2s' }}>
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-truck-fast fa-3x mb-3" style={{ color: '#e53935' }} />
                                    <h5>Fast Delivery</h5>
                                    <p>Track your order and get it delivered hot and fresh.</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '.4s' }}>
                                <div className="p-4 bg-white rounded shadow h-100">
                                    <i className="fa-solid fa-headset fa-3x mb-3" style={{ color: '#e53935' }} />
                                    <h5>24/7 Support</h5>
                                    <p>Our team is ready to help you anytime with your orders.</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/menu" className="btn btn-danger mt-4">View Full Menu</Link>
                    </div>
                </section>

                {/* GALLERY */}
                <section className="py-4 py-lg-5 bg-light">
                    <div className="container-fluid text-center">
                        <h2 className="fw-bold fade-in-up">Food Gallery</h2>
                        <div className="row mt-4 g-3 fade-in-up">
                            <div className="col-12 col-md-4">
                                <img src="/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item" />
                            </div>
                            <div className="col-12 col-md-4">
                                <img src="/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item" />
                            </div>
                            <div className="col-12 col-md-4">
                                <img src="/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center text-light py-4 py-lg-5 join-section" style={{ backgroundColor: '#ff5722' }}>
                    <div className="container-fluid fade-in-up">
                        <h2 className="fw-bold">Craving Something Delicious?</h2>
                        <p className="mt-2">Order now and satisfy your hunger in minutes!</p>
                        <Link to="/menu" className="btn btn-light btn-lg px-4 mt-3">Order Now</Link>
                    </div>
                </section>
            </div>
        </>
    );
}
