import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
}

export function SEO({ title, description, image }: SEOProps) {
    const defaultTitle = "Portfolio - Designer & Developer";
    const defaultDescription = "Découvrez mes projets créatifs et techniques";

    const pageTitle = title ? `${title} | Portfolio` : defaultTitle;
    const pageDescription = description || defaultDescription;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
