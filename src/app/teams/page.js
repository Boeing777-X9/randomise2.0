'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import TeamCard from "@/components/TeamCard";
import Core2025 from "@/data/team/Core2025";
import Exec2025 from "@/data/team/Exec2025";
import FacultyList from "@/data/team/Faculty";

export default function Teams() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [selectYear, setSelectYear] = useState("2025");

  return (
    <div className="md:mt-10 relative min-h-screen bg-gradient-to-br from-[#000000] via-[#020108] to-[#0a051a]">
      {/* Gradient background */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 left-[calc(20%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(21%-18rem)] lg:left-48 lg:top-[calc(60%-30rem)] xl:left-[calc(30%-24rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#3a349f] opacity-30"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
      </div>

      {/* Data */}
      <div className="relative">
        <div className="flex md:justify-end pt-24 px-20 md:px-50 mb-5 ">
          <form className="max-w-2xl ">
            <select
              name="year"
              id="year"
              onChange={(e) => setSelectYear(e.target.value)}
              className="bg-black border hover:bg-gray-900 border-gray-300 text-white text-sm md:text-lg rounded-lg block p-2  md:px-14 cursor-pointer  focus:outline-none "
            >
              <option value="2025">2025-2026</option>
              <option value="2024">2024-2025</option>
              <option value="2023">2023-2024</option>
            </select>
          </form>
        </div>

        <div className="grid place-content-center mb-5">
          <h1 className="text-3xl font-bold text-white sm:text-4xl text-center">
            Faculty
          </h1>
          <div className="my-7 flex-wrap ">
            {FacultyList.map((list, index) => (
              <div
                className=" text-center inline-block gap-7 px-5"
                key={index}
              >
                <div className="flex place-content-center mb-2">
                  <img
                    src={list.imageUrl}
                    className=" rounded-full h-24 w-24 object-cover"
                    alt={list.name}
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-lg font-semibold my-1">{list.name}</h1>
                  <h3 className="text-sm text-gray-300">{list.Position}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2025 Teams */}
        {selectYear == "2025" && (
          <div className="">
            <div className="  pb-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Executive Team
                  </h2>
                </div>
                <div className="flex flex-wrap  justify-center py-5">
                  {Exec2025.map((data) => (
                    <Fade delay={100} key={data.id}>
                      <TeamCard
                        name={data.name}
                        position={data.role}
                        linkdn={data.linkedinUrl}
                        imgSrc={data.imageUrl}
                        github={data.github}
                      />
                    </Fade>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Team 2025 */}
            <div className=" py-24 sm:py-12">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Core Team
                  </h2>
                </div>

                <div className="flex justify-center flex-wrap py-7">
                  {Core2025.map((data) => (
                    <Fade delay={100} key={data.id}>
                      <TeamCard
                        name={data.name}
                        position={data.role}
                        linkdn={data.linkedinUrl}
                        imgSrc={data.imageUrl}
                        github={data.github}
                      />
                    </Fade>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2024 Teams - Placeholder */}
        {selectYear == "2024" && (
          <div className="">
            <div className="  pb-16 ">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Executive Team
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center py-5">
                  <p className="text-white text-center">
                    2024 team data will be added soon...
                  </p>
                </div>
              </div>
            </div>

            {/* Core Team 2024 */}
            <div className=" py-24 sm:py-12">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Core Team
                  </h2>
                </div>

                <div className="flex justify-center flex-wrap py-7">
                  <p className="text-white text-center">
                    2024 core team data will be added soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2023 Teams - Placeholder */}
        {selectYear == "2023" && (
          <div className="">
            <div className="  pb-16 ">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Executive Team
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center py-5">
                  <p className="text-white text-center">
                    2023 team data will be added soon...
                  </p>
                </div>
              </div>
            </div>

            {/* Core Team 2023 */}
            <div className=" py-24 sm:py-12">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto  lg:mx-0 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Core Team
                  </h2>
                </div>

                <div className="flex justify-center flex-wrap py-7">
                  <p className="text-white text-center">
                    2023 core team data will be added soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
