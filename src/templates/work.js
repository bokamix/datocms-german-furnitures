import React, { useState, useEffect } from 'react';
import { HelmetDatoCms } from 'gatsby-source-datocms';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default ({ data }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightBoxOpen, setIsLightboxOpen] = useState(false);
    const [images, setImages] = useState([]);

    const toggleLightBox = (event, obj) => {
        setCurrentImageIndex(obj.index);
        setIsLightboxOpen((prev) => !prev);
    };

    const handleCurrentImageIndexChange = (num) =>
        setCurrentImageIndex(calculateImageIndex(num));

    const calculateImageIndex = (num) =>
        (currentImageIndex + images.length + num) % images.length;

    useEffect(() => {
        const images = data.datoCmsWork.gallery.map(({ fluid }) => ({
            src: fluid.src,
            width: fluid.width,
            height: fluid.height,
        }));

        setImages(images);
    }, [data.datoCmsWork.gallery]);

    return (
        <Layout>
            <article className="sheet">
                <HelmetDatoCms seo={data.datoCmsWork.seoMetaTags} />

                <div className="sheet__inner">
                    <h1 className="sheet__title">{data.datoCmsWork.title}</h1>

                    <p className="sheet__lead">{data.datoCmsWork.excerpt}</p>

                    <div className="sheet__slider">
                        <Gallery photos={images} onClick={toggleLightBox} />

                        {isLightBoxOpen && (
                            <Lightbox
                                mainSrc={images[currentImageIndex].src}
                                nextSrc={images[calculateImageIndex(1)].src}
                                prevSrc={images[calculateImageIndex(-1)].src}
                                onCloseRequest={() => setIsLightboxOpen(false)}
                                onMovePrevRequest={() =>
                                    handleCurrentImageIndexChange(-1)
                                }
                                onMoveNextRequest={() =>
                                    handleCurrentImageIndexChange(1)
                                }
                            />
                        )}
                    </div>

                    <div
                        className="sheet__body"
                        dangerouslySetInnerHTML={{
                            __html:
                                data.datoCmsWork.descriptionNode
                                    .childMarkdownRemark.html,
                        }}
                    />
                </div>
            </article>
        </Layout>
    );
};

export const query = graphql`
    query WorkQuery($slug: String!) {
        datoCmsWork(slug: { eq: $slug }) {
            seoMetaTags {
                ...GatsbyDatoCmsSeoMetaTags
            }
            title
            excerpt
            gallery {
                fluid(
                    maxWidth: 200
                    imgixParams: { fm: "jpg", auto: "compress" }
                ) {
                    src
                    width
                    height
                }
            }
            descriptionNode {
                childMarkdownRemark {
                    html
                }
            }
            coverImage {
                url
                fluid(
                    maxWidth: 1000
                    imgixParams: { fm: "jpg", auto: "compress" }
                ) {
                    ...GatsbyDatoCmsSizes
                }
            }
        }
    }
`;
