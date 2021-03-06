import { h, Component } from 'preact';

import Cup from '../../components/cup';
import DashboardHeader from '../../components/dashboard-header';
import ProductListings from '../../components/product-listings';
import TwilioLogo from '../../components/twilio-logo';
import StatsService from '../../lib/stats';

import style from './style';

export default class Dashboard extends Component {
  constructor(...args) {
    super(...args);
    this.state.loading = true;
    this.state.stats = {};
    this.statsService = StatsService.shared();
    this.statsService.on('updated', ({ stats }) => {
      this.setState({ stats, loading: false });
    });
  }

  componentWillMount() {
    this.statsService.init().then(stats => {
      this.setState({ stats, loading: false });
    });
  }

  render() {
    return this.state.loading ? <p>Loading...</p> : this.renderDashboard();
  }

  renderDashboard() {
    const {
      product,
      expectedOrders,
      totalOrders,
      repoUrl,
      phoneNumbers
    } = this.state.stats;
    const percentage = totalOrders / expectedOrders * 100;
    return (
      <div class={style.dashboard}>
        <DashboardHeader
          url={repoUrl}
          numberOne={phoneNumbers[0]}
          numberTwo={phoneNumbers[1]}
        />
        <div class={style.main}>
          <div class={style.cupContainer}>
            <Cup percentage={percentage} value={totalOrders} />
          </div>
          <div class={style.listingsContainer}>
            <ProductListings products={product} />
          </div>
        </div>
        <footer class={style.footer}>
          <TwilioLogo />
        </footer>
      </div>
    );
  }
}
