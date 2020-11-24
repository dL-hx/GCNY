import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { ChartCard, Field, MiniArea, MiniBar } from '@/components/Charts';
import { Card, Col, Row, Table } from 'antd';
import numeral from 'numeral';
import Pie from '@/components/Charts/Pie';
import TimelineChart from '@/components/Charts/TimelineChart';
import Bar from '@/components/Charts/Bar';
import SimpleTimelineChart from '@/components/Charts/SimpleTimelineChart';

@connect(({ dashboard }) => ({
  dashboard,
}))
class Dashboard extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'dashboard/fetch',
      payload: {},
    });
  }

  render() {
    const { dashboard } = this.props;
    const { userCountSet, userVisitSet, newsCountSet, expertSet, rankTable } = dashboard;

    const columns = [
      {
        title: '提问类别排名',
        dataIndex: 'x',
        key: 'x',
      },
      {
        title: '评论数',
        dataIndex: 'y',
        key: 'y',
        sorter: (a, b) => a.y-b.y,
      },
    ];

    return (
      <PageHeaderWrapper>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <ChartCard
                title="用户数"
                total={numeral(userCountSet.total).format('0,0')}
                contentHeight={46}
              >
                <MiniArea height={46} data={userCountSet.data}/>
              </ChartCard>
            </Col>
            <Col span={8}>
              <ChartCard
                title="资讯访问量"
                total={numeral(userVisitSet.total).format('0,0')}
                contentHeight={46}
              >
                <MiniBar line height={46} data={userVisitSet.data}/>
              </ChartCard>
            </Col>
            <Col span={8}>
              <ChartCard
                title="资讯数量"
                total={numeral(newsCountSet.total).format('0,0')}
                contentHeight={46}
              >
                {/*MiniArea MiniBar*/}
                <MiniBar height={46} data={newsCountSet.data.month}/>
              </ChartCard>
            </Col>
          </Row>
        </div>

        <Card>
          <SimpleTimelineChart
            height={295}
            title='资讯数量'
            data={newsCountSet.data.day}
          />
        </Card>

        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Table
                style={{ background: '#fff', height: 300 }}
                size="small"
                rowKey='x'
                columns={columns}
                dataSource={rankTable}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 10,
                }}
              />
            </Col>
            <Col span={12}>
              <Pie
                hasLegend
                style={{ background: '#fff', height: 300 }}
                subTitle="专家总数"
                total={expertSet.total}
                data={expertSet.data}
                height={294}
              />
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Dashboard;
