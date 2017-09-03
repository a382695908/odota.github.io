/* global API_HOST */
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import strings from 'lang';
import { getTeams } from 'actions';
import Heading from 'components/Heading';
import Table from 'components/Table';
import { getOrdinal, fromNow } from 'utility';
import subTextStyle from 'components/Visualizations/Table/subText.css';

const columns = [{
  displayName: strings.th_rank,
  displayFn: (row, col, field, index) => getOrdinal(index + 1),
},
{
  displayName: strings.th_name,
  field: 'name',
  displayFn: (row, col, field) => (
    <div>
      <span>{field}</span>
      <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
        {fromNow(row.last_match_time)}
      </span>
    </div>),
}, {
  displayName: strings.th_rating,
  field: 'rating',
  sortFn: true,
  relativeBars: true,
  displayFn: (row, col, field) => Math.floor(field),
}, {
  displayName: strings.th_wins,
  field: 'wins',
  sortFn: true,
  relativeBars: true,
}, {
  displayName: strings.th_losses,
  field: 'losses',
  sortFn: true,
  relativeBars: true,
}];

class RequestLayer extends React.Component {
  componentDidMount() {
    this.props.dispatchTeams();
  }
  render() {
    return (<div>
      <Helmet title={strings.header_teams} />
      <Heading title={strings.heading_team_elo_rankings} subtitle={strings.subheading_team_elo_rankings} />
      <Table columns={columns} data={this.props.data.slice(0, 100)} />
    </div>);
  }
}

const mapStateToProps = state => ({
  data: state.app.teams.data.filter(team => team.last_match_time > ((new Date() / 1000) - (60 * 60 * 24 * 30 * 6))),
  loading: state.app.teams.loading,
});

const mapDispatchToProps = dispatch => ({
  dispatchTeams: () => dispatch(getTeams()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
