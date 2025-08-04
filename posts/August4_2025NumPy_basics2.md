---
title: "NumPy Basics 2"
date: "2025-08-04"
subtitle: "More NumPy operations and statistics"
tags: "#Python #ML/DataScience #NumPy"
---
- [Square Root](#square-root)
- [Square](#square)
- [Random Variables](#generating-50-independent-random-variables-from-a-n-0-1-distribution)
- [Array Operations](#creating-an-array-y-by-adding-an-independent-n501-random-variable-to-each-element-of-x)
- [Correlation Matrix](#correlation-matrix)
- [Mean](#computing-mean-of-an-array)
- [Standard Deviation](#standard-deviation)
- [Variance](#variance)
- [Bessel's Correction](#applying-bessels-correction-dividing-by-n-1-change-the-delta-degrees-of-freedom-to-1)
- [Column and Row Means](#mean-of-a-column-or-row-of-data)

---

Before testing remember to import NumPy!

```python
import numpy as np
```

## Square root

```python
x = [25, 49, 81]
np.sqrt(x)
```
`array([5., 7., 9.])`


## Square

```python
numpy_x = np.array(x)
numpy_x**2
```
`array([ 625, 2401, 6561])`


## Generating 50 independent random variables from a $N (0, 1)$ distribution.

$N(0,1)$ means Normal distribution (bell curve) where 0 is the mean and 1 is the standard deviation.

* Random variables without a `default_rng()` will be different on each run.

```python
X = np.random.normal(size=50)
X
```

`
array([-1.40601626,  0.7214838 , -0.09496628,  2.39735926,  1.18898171,
        0.76323124,  1.05925105,  1.48671102,  0.30660224, -1.01944698,
       -1.18494759,  1.37000356, -1.19952148, -0.03482423,  0.60095877,
       -0.01830071,  1.59107384,  1.12081996,  0.10044048,  1.66091275,
        0.06833242,  0.51939868,  0.40795647, -1.64827681,  0.14310729,
       -1.1423812 ,  1.25225891, -0.10193296,  0.37470172, -0.5934665 ,
       -1.80341075,  0.70369082,  0.23672748,  0.14942   ,  0.55380708,
       -0.77558763, -0.65266172, -0.76610702, -0.80075262,  1.15642067,
       -0.91172091,  0.6456585 , -1.3155079 ,  1.42653333, -0.76599893,
       -1.46345512, -0.30072812, -0.70081465, -1.15067792, -0.3178047 ])
`

## Creating an array `y` by adding an independent $N(50,1)$ random variable to each element of `X`.

```python
y = X + np.random.normal(loc=50, scale=1, size=50)
y
```

* `loc` is the mean.
* `scale` is the standard deviation.
* `size` determines the number of random variables to generate.

`
array([51.56076075, 52.13431065, 49.29660332, 48.50495515, 48.18185202,
       50.00832704, 50.26956058, 50.51491111, 50.28365849, 48.87579011,
       50.84213829, 49.22854746, 50.16560162, 49.66720927, 47.69292912,
       49.82166456, 51.1084384 , 48.29948421, 49.22668163, 50.41076018,
       52.36561453, 49.70280929, 49.08306489, 48.49155704, 48.55588808,
       54.293656  , 48.84553873, 48.98669483, 50.07122583, 50.30267524,
       48.42505456, 51.10251517, 47.69915875, 46.45402369, 48.58695418,
       48.64699787, 48.85627297, 51.31704619, 50.32932662, 50.45887703,
       50.84479216, 50.75839768, 52.77570726, 50.92059056, 51.63525329,
       48.45404531, 48.14896332, 52.90059218, 50.66841757, 50.14221893])
`

## Correlation matrix

```python
np.corrcoef(X, y)
```

`
array([[1.        , 0.71800869],
       [0.71800869, 1.        ]])
`

([ corr(X,X) , corr(X,y) ],
 [ corr(y,X) , corr(y,y) ])


## Computing mean of an array

```python
np.mean(y), X.mean()
```

`
(np.float64(49.89946191298883), np.float64(0.036730680978435036))
`

## Standard deviation

```python
np.std(y), X.std()
```

`
(np.float64(1.5086562629961138), np.float64(0.923966607462578))
`

## Variance

Variance is the average of the squared differences from the mean. Subtract the mean from every data point and square it, take the sum of all these values and divide it by the total number of values.

```python
np.var(y), X.var()
```

`
(np.float64(2.1311897491972185), np.float64(1.0063147032427298))
`

### Applying Bessel's correction (dividing by \$n-1\$) change the delta degrees of freedom to 1:

```python
np.var(y, ddof=1)
```

`
np.float64(2.322493591711632)
`

## Mean of a column or row of data

```python
rng = np.random.default_rng(3)
X = rng.standard_normal((10, 3))
X
```

`
array([[ 2.04091912, -2.55566503,  0.41809885],
       [-0.56776961, -0.45264929, -0.21559716],
       [-2.01998613, -0.23193238, -0.86521308],
       [ 3.32299952,  0.22578661, -0.35263079],
       [-0.28128742, -0.66804635, -1.05515055],
       [-0.39080098,  0.48194539, -0.23855361],
       [ 0.9577587 , -0.19980213,  0.02425957],
       [ 1.54582085,  0.54510552, -0.50522874],
       [-0.18283897,  0.54052513,  1.93508803],
       [-0.26962033, -0.24355868,  1.0023136 ]])
`

Mean of each column:

```python
X.mean(0)
```

`
array([ 0.41551948, -0.25582912,  0.01473861])
`

Mean of each row:

```python
X.mean(1)
```

`
array([-0.03221569, -0.41200535, -1.03904386,  1.06538511, -0.66816144,
       -0.0491364 ,  0.26073871,  0.52856588,  0.76425806,  0.16304486])
`


