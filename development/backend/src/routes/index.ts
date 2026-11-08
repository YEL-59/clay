import { Router } from 'express';
import adminRoutes from './adminRoutes';
import customerRoutes from './customerRoutes';
import enterpriseRoutes from './enterpriseRoutes';
import fitSessionRoutes from './fitSessionRoutes';
import orderRoutes from './orderRoutes';
import overviewRoutes from './overviewRoutes';
import productRoutes from './productRoutes';
import promoRoutes from './promoRoutes';
import settingsRoutes from './settingsRoutes';

const apiRouter = Router();

apiRouter.use('/overview', overviewRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/fit-sessions', fitSessionRoutes);
apiRouter.use('/promos', promoRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/', enterpriseRoutes);

export default apiRouter;
