import { NextResponse } from 'next/server';
import { prisma } from 'utils/prisma/init';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  console.log('host..', host);
  const subdomain = host.split('.')[0]; // Extract subdomain
  console.log('subdomain..', subdomain);
  if (subdomain && subdomain != 'www' && subdomain != 'tfyp') {
    // Redirect to another page or route
    let subdomainRedirect;
    try {
      subdomainRedirect = await prisma.subdomainRedirect.findFirst({ where: { subdomain } });
      console.log('subdomainredirect..', subdomainRedirect);
    } catch (err) {}
    if (subdomainRedirect?.redirect) NextResponse.redirect(subdomainRedirect.redirect);
    else NextResponse.next();
  } else {
    NextResponse.next();
  }
}
