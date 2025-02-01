export default function Home() {
  return (
        <div
            className="hero min-h-screen"
            style={{
              backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
            }}>
          <div className="hero-overlay"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Rio Bahtiar</h1>
              <p className="mb-5">
                  Rio is a lifetime learner and enjoys experimenting with new technologies. In his free time, he enjoys reading, swimming, and watching Sci-fi movies..
              </p>
              <button className="btn btn-primary">Hello</button>
            </div>
          </div>
        </div>
  );
}
