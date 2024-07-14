import { NextResponse } from 'next/server';

export default async function middleware(request) {

    const host = request.headers.host;
    console.log('host.', host);
    const subdomain = host.split('.')[0]; // Extract subdomain
    console.log('subdomain.', subdomain);
    if (subdomain && subdomain != 'www' && subdomain != 'tfyp') {
      // Redirect to another page or route
      let subdomainRedirect;
      try {
        subdomainRedirect = await prisma.subdomainRedirect.findFirst({ where: { subdomain } });
        console.log('subdomainredirect.', subdomainRedirect)
      } catch (err) {}
      if (subdomainRedirect?.redirect) NextResponse.redirect(subdomainRedirect.redirect);
      else NextResponse.next();
    } else {
        NextResponse.next();
    }
/*
  const host = request.headers.get('host');
  const subdomain = host.split('.')[0];

  // Add your dynamic redirection logic here
  if (subdomain === 'subdomain') {
    return NextResponse.redirect('https://example.com/target-page');
  }

  // Continue to the next middleware or route
  return NextResponse.next();*/
}