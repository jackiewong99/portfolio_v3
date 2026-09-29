import React from 'react';
import { experienceList } from '../../data/experience';

export default function Experience() {
  return (
    <section
      id='experience'
      className='flex flex-col items-start justify-center gap-9 mx-auto max-w-7xl min-h-screen p-6 lg:p-8'
    >
      <div id='experience-header'>
        <h2 className='font-semibold text-3xl'>Experience</h2>
        <div aria-hidden='true' className='mt-3 h-0.5 w-39 bg-fog-line' />
      </div>
      <div>
        <ul className='flex flex-col gap-9'>
          {experienceList.map((item, index) => (
            <React.Fragment key={index}>
              <li className='flex flex-col justify-center gap-5 lg:flex-row lg:justify-start lg:gap-18'>
                <div>
                  <p className='font-mono'>{item.timeline}</p>
                </div>
                <div className='flex flex-col justify-start gap-5'>
                  <div>
                    <h3 className='font-sans font-semibold'>{item.company}</h3>
                    <p className='font-mono opacity-75'>{item.role}</p>
                  </div>
                  <p className='text-prose'>{item.desc}</p>
                </div>
              </li>
              {index !== experienceList.length - 1 && (
                <div aria-hidden='true' className='h-0.5 w-full bg-fog-line' />
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
