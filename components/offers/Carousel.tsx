'use client'

import { useState } from 'react'
import Btn from './Carousel/Btn'
import Content from './Carousel/Content'
import Dots from './Carousel/Dots'
import { type SuggestedOffersWithRelationships } from '@/lib/types'

interface Props {
  offers: SuggestedOffersWithRelationships
}

export default function Carousel({ offers }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const offer = offers[currentSlide]
  const previousSlide = currentSlide === 0 ? offers.length - 1 : currentSlide - 1
  const nextSlide = currentSlide === offers.length - 1 ? 0 : currentSlide + 1

  return (
    <div className="overflow-hidden">
      <div className="relative flex">
        <section
          key={offer.title}
          className="flex w-full grow-0 flex-col"
        >
          <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Imagen de fondo carrusel" className="absolute right-0 top-0 h-full w-full object-cover" />
          <div className="relative z-10 h-full w-full px-4 pt-6 backdrop-blur-sm backdrop-brightness-50 sm:px-0">
            <Content
              id={offer.id}
              title={offer.title}
              categories={offer.categories}
              description={offer.description}
              owner={offer.company.name}
              location={offer.location.title}
            />
            <div className="my-4 flex w-full flex-row items-center justify-center gap-4">
              <div className="flex rounded-lg">
                <Btn direction="left" onClick={() => { setCurrentSlide(previousSlide) }} />
                <Dots length={offers.length} current={currentSlide} />
                <Btn direction="right" onClick={() => { setCurrentSlide(nextSlide) }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}