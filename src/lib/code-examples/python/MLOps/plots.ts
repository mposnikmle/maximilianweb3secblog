export const plots = {
    code: `import os
from typing import Sequence
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix


def save_confusion_matrix(y_true: pd.Series,
                          y_pred: np.ndarray,
                          labels: Sequence[str],
                          output_path: str) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(16, 14))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=labels,
        yticklabels=labels,
        cbar_kws={"label": "Number of Predictions"},
        linewidths=0.5,
        linecolor="gray",
    )
    plt.title("Confusion Matrix: Disease/Diagnosis Predictions", fontsize=16, fontweight="bold", pad=20)
    plt.xlabel("Predicted Disease/Diagnosis", fontsize=12, fontweight="bold")
    plt.ylabel("True Disease/Diagnosis", fontsize=12, fontweight="bold")
    plt.xticks(rotation=45, ha="right")
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()
    return output_path


def save_class_distribution(y_train: pd.Series,
                            y_test: pd.Series,
                            output_path: str) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    train_counts = y_train.value_counts().sort_index()
    test_counts = y_test.value_counts().sort_index()
    df_plot = pd.DataFrame({"Training Set": train_counts, "Test Set": test_counts})
    fig, ax = plt.subplots(figsize=(14, 8))
    df_plot.plot(kind="bar", ax=ax, width=0.8, color=["#3498db", "#e74c3c"])
    plt.title("Class Distribution: Training vs Test Set", fontsize=16, fontweight="bold", pad=20)
    plt.xlabel("Disease/Diagnosis", fontsize=12, fontweight="bold")
    plt.ylabel("Number of Samples", fontsize=12, fontweight="bold")
    plt.legend(title="Dataset", fontsize=10, title_fontsize=11)
    plt.xticks(rotation=45, ha="right")
    plt.grid(axis="y", alpha=0.3, linestyle="--")
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()
    return output_path


def save_top_keywords(pipeline,
                      output_path: str,
                      n_keywords: int = 10,
                      n_specialties: int = 6) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    tfidf = pipeline.named_steps["tfidf"]
    classifier = pipeline.named_steps["classifier"]
    feature_names = np.array(tfidf.get_feature_names_out())
    class_labels = classifier.classes_
    feature_log_prob = classifier.feature_log_prob_
    n_specialties = min(n_specialties, len(class_labels))
    selected_indices = np.linspace(0, len(class_labels) - 1, n_specialties, dtype=int)
    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    axes = axes.ravel()
    for idx, class_idx in enumerate(selected_indices):
        specialty = class_labels[class_idx]
        top_indices = np.argsort(feature_log_prob[class_idx])[-n_keywords:][::-1]
        top_features = feature_names[top_indices]
        top_scores = feature_log_prob[class_idx][top_indices]
        top_scores_norm = (top_scores - top_scores.min()) / (top_scores.max() - top_scores.min() + 1e-10)
        axes[idx].barh(range(n_keywords), top_scores_norm, color="#2ecc71")
        axes[idx].set_yticks(range(n_keywords))
        axes[idx].set_yticklabels(top_features)
        axes[idx].invert_yaxis()
        axes[idx].set_xlabel("Relative Importance", fontsize=9)
        axes[idx].set_title(f"{specialty}", fontsize=11, fontweight="bold")
        axes[idx].grid(axis="x", alpha=0.3)
    plt.suptitle("Top 10 Predictive Keywords by Disease/Diagnosis", fontsize=16, fontweight="bold", y=0.995)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()
    return output_path
`
}