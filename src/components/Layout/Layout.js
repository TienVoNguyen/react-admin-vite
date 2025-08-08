import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton, CircularProgress, Box } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from '../Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';
import BreadCrumbs from '../../components/BreadCrumbs';

// context
import { useLayoutState } from '../../context/LayoutContext';
import { ProductsProvider } from '../../context/ProductContext';

// Lazy-loaded components for code splitting
const Dashboard = lazy(() => import('../../pages/dashboard'));
const Profile = lazy(() => import('../../pages/profile'));
const EditUser = lazy(() => import('../../pages/user/EditUser'));

// Core pages
const TypographyPage = lazy(() => import('../../pages/typography'));
const ColorsPage = lazy(() => import('../../pages/colors'));
const GridPage = lazy(() => import('../../pages/grid'));

// Tables
const StaticTablesPage = lazy(() => import('../../pages/tables'));
const DynamicTablesPage = lazy(() => import('../../pages/tables/dynamic'));

// UI Components
const IconsPage = lazy(() => import('../../pages/icons'));
const BadgesPage = lazy(() => import('../../pages/badge'));
const CarouselsPage = lazy(() => import('../../pages/carousel'));
const CardsPage = lazy(() => import('../../pages/cards'));
const ModalsPage = lazy(() => import('../../pages/modal'));
const NotificationsPage = lazy(() => import('../../pages/notifications'));
const NavbarsPage = lazy(() => import('../../pages/nav'));
const TooltipsPage = lazy(() => import('../../pages/tooltips'));
const TabsPage = lazy(() => import('../../pages/tabs'));
const ProgressPage = lazy(() => import('../../pages/progress'));
const WidgetsPage = lazy(() => import('../../pages/widget'));

// E-commerce
const Ecommerce = lazy(() => import('../../pages/ecommerce'));
const Product = lazy(() => import('../../pages/ecommerce/Products'));
const ProductsGrid = lazy(() => import('../../pages/ecommerce/ProductsGrid'));
const CreateProduct = lazy(() => import('../../pages/ecommerce/CreateProduct'));

// Forms
const FormsElements = lazy(() => import('../../pages/forms/elements'));
const FormValidation = lazy(() => import('../../pages/forms/validation'));

// Charts
const Charts = lazy(() => import('../../pages/charts'));
const LineCharts = lazy(() => import('../../pages/charts/LineCharts'));
const BarCharts = lazy(() => import('../../pages/charts/BarCharts'));
const PieCharts = lazy(() => import('../../pages/charts/PieCharts'));

// Other pages
const DraggableGrid = lazy(() => import('../../pages/draggablegrid'));
const MapsGoogle = lazy(() => import('../../pages/maps'));
const VectorMaps = lazy(() => import('../../pages/maps/VectorMap'));
const Timeline = lazy(() => import('../../pages/timeline'));
const Search = lazy(() => import('../../pages/search'));
const Gallery = lazy(() => import('../../pages/gallery'));
const Invoice = lazy(() => import('../../pages/invoice'));
const Calendar = lazy(() => import('../../pages/calendar'));

// CRUD pages
const UsersFormPage = lazy(() => import('../../pages/CRUD/Users/form/UsersFormPage'));
const UsersTablePage = lazy(() => import('../../pages/CRUD/Users/table/UsersTablePage'));

// Loading component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

//Sidebar structure
import structure from '../Sidebar/SidebarStructure'

const Redirect = (props) => {
  useEffect(() => window.location.replace(props.url));
  return <span>Redirecting...</span>;
};

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar structure={structure} />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route path='/app/dashboard' component={Dashboard} />
            <Route path="/app/profile" component={Profile} />
            <Route path='/app/user/edit' component={EditUser} />

            <Route exact path="/app/core" render={() => <Redirect to="/app/core/typography" />} />
            <Route path="/app/core/typography" component={TypographyPage} />
            <Route path="/app/core/colors" component={ColorsPage} />
            <Route path="/app/core/grid" component={GridPage} />

            <Route exact path="/app/tables" render={() => <Redirect to={'/app/tables/static'} />} />
            <Route path="/app/tables/static" component={StaticTablesPage} />
            <Route path="/app/tables/dynamic" component={DynamicTablesPage} />

            <Route exact path="/app/ui" render={() => <Redirect to="/app/ui/icons" />} />
            <Route path="/app/ui/icons" component={IconsPage} />
            <Route path="/app/ui/badge" component={BadgesPage} />
            <Route path="/app/ui/carousel" component={CarouselsPage} />
            <Route path="/app/ui/modal" component={ModalsPage} />
            <Route path="/app/ui/navbar" component={NavbarsPage} />
            <Route path="/app/ui/tooltips" component={TooltipsPage} />
            <Route path="/app/ui/tabs" component={TabsPage} />
            <Route path="/app/ui/cards" component={CardsPage} />
            <Route path="/app/ui/widget" component={WidgetsPage} />
            <Route path="/app/ui/progress" component={ProgressPage} />
            <Route path="/app/ui/notifications" component={NotificationsPage} />

            <Route exact path="/app/forms" render={() => <Redirect to="/app/forms/elements" />} />
            <Route path="/app/forms/elements" component={FormsElements} />
            <Route path="/app/forms/validation" component={FormValidation} />

            <Route exact path="/app/charts" render={() => <Redirect to={'/app/charts/overview'} />} />
            <Route path="/app/charts/overview" component={Charts} />
            <Route path="/app/charts/line" component={LineCharts} />
            <Route path="/app/charts/bar" component={BarCharts} />
            <Route path="/app/charts/pie" component={PieCharts} />

            <Route path="/app/grid" component={DraggableGrid} />

            <Route exact path="/app/maps" render={() => <Redirect to="/app/maps/google" />} />
            <Route path="/app/maps/google" component={MapsGoogle} />
            <Route path="/app/maps/vector" component={VectorMaps} />

            <Route exact path="/app/extra" render={() => <Redirect to="/app/extra/timeline" />} />
            <Route path="/app/extra/timeline" component={Timeline} />
            <Route path="/app/extra/search" component={Search} />
            <Route path="/app/extra/gallery" component={Gallery} />
            <Route path="/app/extra/invoice" component={Invoice} />
            <Route path="/app/extra/calendar" component={Calendar} />

            <Route path="/app/ecommerce/management" exact>
              <ProductsProvider>
                <Ecommerce />
              </ProductsProvider>
            </Route>
            <Route path="/app/ecommerce/management/edit/:id" exact>
              <ProductsProvider>
                <CreateProduct />
              </ProductsProvider>
            </Route>
            <Route path="/app/ecommerce/management/create">
              <ProductsProvider>
                <CreateProduct />
              </ProductsProvider>
            </Route>
            <Route path="/app/ecommerce/product/:id" component={Product} />
            <Route path="/app/ecommerce/product" component={Product} />
            <Route path="/app/ecommerce/gridproducts" component={ProductsGrid} />

            <Route path={'/app/users'} exact component={UsersTablePage} />
            <Route path={'/app/user/new'} exact component={UsersFormPage} />
            <Route
              path={'/app/users/:id/edit'}
              exact
              component={UsersFormPage}
            />
          </Switch>
        </Suspense>
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/'}
              target={'_blank'}
              className={classes.link}
            >
              Flatlogic
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/about'}
              target={'_blank'}
              className={classes.link}
            >
              About Us
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/blog'}
              target={'_blank'}
              className={classes.link}
            >
              Blog
            </Link>
          </div>
          <div>
            <Link href={'https://www.facebook.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='facebook'>
                <FacebookIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://twitter.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='twitter'>
                <TwitterIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://github.com/flatlogic'} target={'_blank'}>
              <IconButton
                aria-label='github'
                style={{ padding: '12px 0 12px 12px' }}
              >
                <GithubIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

export default withRouter(connect()(Layout));
