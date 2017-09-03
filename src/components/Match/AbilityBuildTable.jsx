import React from 'react';
import { isRadiant, getTeamName } from 'utility';
import { IconRadiant, IconDire } from 'components/Icons';
import Heading from 'components/Heading';
import Table from 'components/Table';
import styles from './Match.css';

const filterMatchPlayers = (players, team = '') =>
  players
    .filter(player => (team === 'radiant' && isRadiant(player.player_slot)) || (team === 'dire' && !isRadiant(player.player_slot)) || team === '')
    .sort((a, b) => a.player_slot - b.player_slot);

const standardizeLevel = (skilledAt, obj) => {
  // Invoker (74) is different than everyone else
  if (obj.hero_id !== 74) {
    if (skilledAt === 16) {
      return 17;
    } else if (skilledAt === 17) {
      return 19;
    } else if (skilledAt === 18) {
      return 24;
    }
  }
  return skilledAt;
};

const convertArrayToKeys = (obj, fieldName = '') => ({
  ...obj,
  ...(obj[fieldName] || []).reduce(
    (acc, cur, index) => ({
      ...acc,
      [`ability_upgrades_arr_${standardizeLevel(index, obj) + 1}`]: cur,
    }),
    {},
  ),
});

export default ({ players = [], columns, heading = '', radiantTeam = {}, direTeam = {}, summable = false }) => {
  const keyedPlayers = players.map(player => convertArrayToKeys(player, 'ability_upgrades_arr'));
  return (
    <div>
      <Heading title={`${getTeamName(radiantTeam, true)} - ${heading}`} icon={<IconRadiant className={styles.iconRadiant} />} />
      <Table data={filterMatchPlayers(keyedPlayers, 'radiant')} columns={columns} summable={summable} />
      <Heading title={`${getTeamName(direTeam, false)} - ${heading}`} icon={<IconDire className={styles.iconDire} />} />
      <Table data={filterMatchPlayers(keyedPlayers, 'dire')} columns={columns} summable={summable} />
    </div>
  );
};
