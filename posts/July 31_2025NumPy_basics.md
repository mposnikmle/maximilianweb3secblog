---
title: "NumPy Basics"
date: "2025-07-31"
subtitle: "Intro to NumPy arrays"
tags: "#Python #ML/DataScience #NumPy"
---
## Importing NumPy:

```python
import numpy as np
```
---
## NumPy array vs Python array:

```python
a = np.array([3, 4, 5])
b = np.array([4, 9, 7])
a + b
```
output:

```
array([ 7, 13, 12])
```
---
## Two-dimensional NumPy array/ matrix

```python
x = np.array([[1, 2], [3, 4]])
x
```
output:

```
array([[1, 2], 
	   [3, 4]])
```
---
## Number of dimensions in a NumPy array
```python
x.ndim
```
output:

```
2
```
---
## Data type stored within the array

```python
x.dtype
```
output:

```
dtype('int64')
```
---
## Number of rows and columns respectively

```python
x.shape
```
output:

```
(2, 2)
```
---
# Finding the sum of a NumPy array

```python
x.sum()
```
output:

```
np.int64(10)
```

same thing:

```python
np.sum(x)
```
output:

```
np.int64(10)
```
---
### Reshaping an array:

```Python
x = np.array([1, 2, 3, 4, 5, 6])
x
```
output:

```
array([1, 2, 3, 4, 5, 6])
```

---

```Python
x = x.reshape((3, 2))
x
```
output:

```
array([[1, 2], 
	   [3, 4], 
	   [5, 6]])
```

* Note: NumPy arrays are specified as a sequence of rows, *row-major ordering*, as opposed to *column-major ordering*.