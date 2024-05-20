import React from 'react'
import logov6 from "../assets/logov6.png";

export default function HomeVolunteer() {
  return (
    <section id="hero" className=" dark:bg-gray-900 min-h-screen max-w-full bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400">
      {/* bg-hero bg-gradient-to-r from-orange-500 to-yellow-500 bg-gradient-to-r from-orange-400 via-indigo-600 to-yellow-300*/}
      {/* <div className="flex flex-col items-center justify-center py-8 px-4 text-center mx-auto max-w-screen-xl lg:py-16 lg:px-12"> */}

      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-12">
        <div  className="mr-auto place-self-center lg:col-span-7">
        {/* <iframe src="https://www.youtube.com/embed/tDSiR1EzYtw" width={500} height={300} title='A youtube video on React hooks'></iframe> */}
        <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-7xl text-white font-futura">
            NCYM 2024
          </h1>
          <p className="max-w-2xl mb-6 lg:mb-2 md:text-lg lg:text-xl text-white">
            national conference of youth ministers 2024{" "}
          </p>
          <p className="max-w-2xl mb-6 md:text-lg lg:mb-8 text-gray-200 font-light font-abc">
          The 2024 National Conference of Youth Ministers draws inspiration from Pope Francis' message at the 28th World Youth Day on November 26, 2023. He described the youth of the Universal Church as the "joyful hope of the church" and emphasized their role as agents of change. This event marks the beginning of the youth's journey, entrusted to Mary, Mother and Our Lady of Hope, leading up to the 2025 Jubilee Year themed as "Pilgrims of Hope."
          </p>
          <a
            href="#primer"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-gray-800  hover:bg-yellow-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Learn More
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
               fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={logov6} alt="mockup" className="max-w-full" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mx-auto lg:py-8 max-w-screen-xl">
        <div className="bg-slate-500" id="primer">

          {/* <img src={p1} alt="p1" className="shadow-2xl" />
          <img src={p2} alt="p2" className="shadow-2xl" />
          <img src={p3} alt="p1" className="shadow-2xl" />
          <img src={p5} alt="p1" className="shadow-2xl" />
          <img src={p6} alt="p2" className="shadow-2xl" /> */}
        </div>
      </div>
    </section>
  )
}
