/*
 * Tencent is pleased to support the open source community by making TKEStack
 * available.
 *
 * Copyright (C) 2012-2020 Tencent. All Rights Reserved.
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

// Code generated by lister-gen. DO NOT EDIT.

package internalversion

import (
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/tools/cache"
	platform "tkestack.io/tke/api/platform"
)

// LogCollectorLister helps list LogCollectors.
type LogCollectorLister interface {
	// List lists all LogCollectors in the indexer.
	List(selector labels.Selector) (ret []*platform.LogCollector, err error)
	// Get retrieves the LogCollector from the index for a given name.
	Get(name string) (*platform.LogCollector, error)
	LogCollectorListerExpansion
}

// logCollectorLister implements the LogCollectorLister interface.
type logCollectorLister struct {
	indexer cache.Indexer
}

// NewLogCollectorLister returns a new LogCollectorLister.
func NewLogCollectorLister(indexer cache.Indexer) LogCollectorLister {
	return &logCollectorLister{indexer: indexer}
}

// List lists all LogCollectors in the indexer.
func (s *logCollectorLister) List(selector labels.Selector) (ret []*platform.LogCollector, err error) {
	err = cache.ListAll(s.indexer, selector, func(m interface{}) {
		ret = append(ret, m.(*platform.LogCollector))
	})
	return ret, err
}

// Get retrieves the LogCollector from the index for a given name.
func (s *logCollectorLister) Get(name string) (*platform.LogCollector, error) {
	obj, exists, err := s.indexer.GetByKey(name)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, errors.NewNotFound(platform.Resource("logcollector"), name)
	}
	return obj.(*platform.LogCollector), nil
}
