import React from 'react';

export interface FilterFormProps {
  formList:any[],
  filterSubmit:  (value: {}) => void,
  addButton?: false|{
    pathname: string,
  },
  auditButton?:false| {
    auditKeys:number[],
    auditSubmit: (auditKeys:string, type:string | 'AuditConfirm' | 'AuditCancel') => {},
  },
}

export default class FilterForm extends React.Component<FilterFormProps, any> {}
