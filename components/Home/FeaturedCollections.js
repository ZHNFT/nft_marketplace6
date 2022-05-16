import clsx from 'clsx';
import Slider from "react-slick";
import Spinner from "../Spinner/Spinner";
import CollectionCard from "../Collection/CollectionCard";
import { ArrowIcon } from '../icons';
import useResponsive from '../../hooks/useResponsive';

function Arrow(props) {
  return (
    <button
      onClick={event => { event.preventDefault(); props.onClick(); }}
      className={clsx(
        'hidden lg:block absolute top-0 bottom-0',
        props.type === "next" ? "lg:-right-[30px] xl:-right-[45px]" : "lg:-left-[30px] xl:-left-[45px]"
      )}
    >
      <span className={clsx(
        'flex justify-center items-center bg-black/[0.1] dark:bg-white/[0.05] hover:bg-cobalt dark:hover:bg-cornflower rounded-full',
        'w-[38px] h-[38px]'
      )}>
        <ArrowIcon className="w-[11px]" type={props.type === 'prev' ? 'left' : 'right'} />
      </span>
    </button>
  )
}

const getSlidesToShow = ({ isMedium, isSmall }) => {
  if (isSmall) return 1;
  if (isMedium) return 2;
  return 3;
};

export default function FeaturedCollections({ isLoading, featuredCollections }) {
  const isSmall = useResponsive({ query: '(max-width: 640px)' });
  const isMedium = useResponsive({ query: '(max-width: 900px)' });
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: getSlidesToShow({ isMedium, isSmall }),
    slidesToScroll: 1
  };

  return (
    <section>
      <h2 className="text-center text-3xl font-semibold mb-6 gradient-text">Featured collections</h2>
      {
        isLoading
          ? (
            <div className="flex justify-center items-center h-24">
              <Spinner className="w-[26px] dark:text-white text-ink" />
            </div>
          )
          : !!featuredCollections && (
            <>
              {
                featuredCollections.length > 0
                  ? (
                    <Slider 
                      {...settings}
                      nextArrow={<Arrow type="next" />}
                      prevArrow={<Arrow type="prev" />}
                    >
                        {featuredCollections?.map((collection, index) => (
                          <div key={`${collection.address}_${index}`}>
                            <div className="mx-4">
                              <CollectionCard collection={collection} size="sml" truncateDescription />
                            </div>
                          </div>
                        ))}
                    </Slider>
                  )
                  : (
                    <div className="flex justify-center items-center h-24">
                      <p className="text-sm">No collections found</p>
                    </div>
                  )
              }
            </>
          )
      }
    </section>
  );
}