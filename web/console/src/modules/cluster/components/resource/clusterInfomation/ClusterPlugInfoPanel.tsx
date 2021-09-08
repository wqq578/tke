/*
 * Tencent is pleased to support the open source community by making TKEStack
 * available.
 *
 * Copyright (C) 2012-2021 Tencent. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 * https://opensource.org/licenses/Apache-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */
import React from 'react';
import { FormPanel } from '@tencent/ff-component';
import { Table, TableColumn, Button, Icon, Bubble } from '@tea/component';
import { RootProps } from '../../ClusterApp';
import { FetchState } from '@tencent/ff-redux';
import { router } from '../../../router';
import { ContainerRuntimeEnum } from '@src/modules/cluster/constants/Config';

enum PlugType {
  Promethus,
  LogAgent
}

export const ClusterPlugInfoPanel: React.FC<RootProps> = ({ cluster, actions, route }) => {
  const { promethus = null, logAgent = null } = cluster?.selection?.spec ?? {};
  const clusterId = cluster?.selection?.metadata?.name ?? '';

  const isContainerd = cluster?.selection?.spec?.features?.containerRuntime === ContainerRuntimeEnum.CONTAINERD;

  const open = (type: PlugType) => () => {
    switch (type) {
      case PlugType.Promethus:
        router.navigate({ sub: 'config-promethus' }, { rid: route.queries['rid'], clusterId: route.queries.clusterId });
        break;
      case PlugType.LogAgent:
        actions.cluster.enableLogAgent(cluster.selection);
        break;
    }

    actions.cluster.applyFilter({});
  };

  const close = (type: PlugType) => () => {
    switch (type) {
      case PlugType.Promethus:
        actions.cluster.disablePromethus(cluster.selection);
        break;
      case PlugType.LogAgent:
        actions.cluster.disableLogAgent(cluster.selection);
        break;
    }

    actions.cluster.applyFilter({});
  };

  const columns: TableColumn[] = [
    { key: 'plug', header: '组件' },
    { key: 'des', header: '描述' },
    { key: 'status', header: '状态' },
    {
      key: 'action',
      header: '操作',
      render({ action, type }) {
        const disabled = type === PlugType.LogAgent && isContainerd;

        return action ? (
          <>
            <Button type="link" onClick={close(type)}>
              关闭
            </Button>
          </>
        ) : (
          <Bubble content={disabled ? '运行时为containerd的集群不支持开启日志采集' : ''}>
            <Button type="link" disabled={disabled} onClick={open(type)}>
              开启
            </Button>
          </Bubble>
        );
      }
    }
  ];

  const records = [
    {
      plug: <a href={`/tkestack/alarm?clusterId=${clusterId}`}>监控告警</a>,
      des: '监控告警，prometheus',
      status: promethus ? promethus.status.phase : '未安装',
      action: promethus,
      type: PlugType.Promethus
    },

    {
      plug: <a href={`/tkestack/log?clusterId=${clusterId}`}>日志采集</a>,
      des: '日志采集，logagent',
      status: logAgent ? logAgent.status.phase : '未安装',
      action: logAgent,
      type: PlugType.LogAgent
    }
  ];

  return (
    <FormPanel title="组件信息">
      {cluster.list.fetched !== true || cluster.list.fetchState === FetchState.Fetching ? (
        <Icon type="loading" />
      ) : (
        <Table
          columns={columns}
          records={records}
          recordKey="des"
          rowDisabled={({ type }) => type === PlugType.LogAgent && isContainerd}
        />
      )}
    </FormPanel>
  );
};
