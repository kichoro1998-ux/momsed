export default function Gallery() {
    return (
        <>
            {/* HERO / PAGE TITLE */}
            <section
                className="menu-hero d-flex align-items-center text-light"
                style={{ minHeight: '50vh', backgroundColor: '#ff5722', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="container-fluid text-center">
                    <h1 className="display-3 fw-bold">Food Gallery</h1>
                    <p className="lead mt-3">
                        Explore our delicious meals and menu highlights from top restaurants near you!
                    </p>
                </div>
            </section>

            {/* GALLERY GRID */}
            <section className="py-5">
                <div className="container-fluid text-center">
                    <h2 className="fw-bold fade-in-up">Our Delicious Selections</h2>
                    <p className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        From mouth-watering starters to satisfying main courses, see what QuickBites has to offer.
                    </p>

                    <div className="row mt-4 g-4">
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up">
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 1" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.1s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 2" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.2s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 3" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.3s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 4" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.4s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 5" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.5s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 6" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.6s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 7" />
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-3 fade-in-up" style={{ animationDelay: '.7s' }}>
                            <img src="/public/foodpic.jpg" className="img-fluid rounded shadow" alt="Food Item 8" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA / ORDER NOW */}
            <section
                className="text-center text-light py-5 join-section fade-in-up"
                style={{ backgroundColor: '#ff5722' }}
            >
                <div className="container-fluid">
                    <h2 className="fw-bold">Craving Something Delicious?</h2>
                    <p className="mt-2">
                        Order your favorite meals now and get them delivered straight to your door!
                    </p>
                    <a href="/menu" className="btn btn-light btn-lg mt-3 px-4">
                        Order Now
                    </a>
                </div>
            </section>
        </>
    );
}
