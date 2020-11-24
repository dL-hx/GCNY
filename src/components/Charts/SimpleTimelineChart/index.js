import React from 'react';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import { isEmptyArray } from '@/utils/utils';

function getComponent(data) {
  const ds = new DataSet({
    state: {
      start: new Date(data[0].x).getTime(),
      end: new Date(data[data.length - 1].x).getTime(),
    },
  });
  const dv = ds.createView('origin').source(data);
  dv.transform({
    type: 'filter',

    callback(obj) {
      const time = new Date(obj.x).getTime(); // !注意：时间格式，建议转换为时间戳进行比较

      return time >= ds.state.start && time <= ds.state.end;
    },
  });

  let chart;

  class SliderChart extends React.Component {
    onChange(obj) {
      const { startValue, endValue } = obj;
      ds.setState('start', startValue);
      ds.setState('end', endValue);
    }

    render() {
      const { height , title} = this.props;

      const scale = {
        x: {
          type: 'time',
          tickCount: 8,
        },
        y: {
          alias: title,
        },
      };

      return (
        <div>
          <Chart
            height={height}
            data={dv}
            padding={[40, 40, 40, 80]}
            scale={scale}
            onGetG2Instance={g2Chart => {
              g2Chart.animate(false);
              chart = g2Chart;
            }}
            forceFit
          >
            <Axis name="y" title/>
            <Tooltip/>
            <Geom
              type="area"
              position="x*y"
              color="l(100) 0:#1890ff"
              opacity={0.85}
            />
          </Chart>
          <div>
            <Slider
              width="auto"
              height={26}
              start={ds.state.start}
              end={ds.state.end}
              xAxis="x"
              yAxis="y"
              scales={{
                x: {
                  type: 'time',
                  tickCount: 10,
                  mask: 'YYYY/MM/DD',
                },
              }}
              data={dv}
              backgroundChart={{
                type: 'line',
              }}
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
      );
    }
  }

  return SliderChart;
}

class SimpleTimelineChart extends React.Component {
  render() {
    const { title, data: sourceData } = this.props;

    const data = Array.isArray(sourceData) && !isEmptyArray(sourceData) ? sourceData : [{ x: 0, y: 0 }];
    const SliderChart = getComponent(data);
    return (
      <div>
        {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
        <SliderChart {...this.props}/>
      </div>
    );
  }
}

export default SimpleTimelineChart;

