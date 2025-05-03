import { startServerAndCreateNextHandler } from '@as-integrations/next';
import server from '../../lib/apolloServer';
import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
      await dbConnect();
      return { req };
    },
  });

export { handler as GET, handler as POST };
