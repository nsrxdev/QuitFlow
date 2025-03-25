"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getReviews, submitReview, likeReview, getComments, submitComment } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"
import { ThumbsUp, MessageSquare, Send } from "lucide-react"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [newComment, setNewComment] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        const { data, error } = await getReviews()
        if (error) throw error

        setReviews(data || [])
      } catch (err) {
        console.error("Error fetching reviews:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmitReview = async () => {
    if (!newReview.trim() || !user) return

    setSubmitting(true)

    try {
      await submitReview(user.id, newReview)

      // Refresh reviews
      const { data } = await getReviews()
      setReviews(data || [])

      // Clear input
      setNewReview("")
    } catch (err) {
      console.error("Error submitting review:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (reviewId: string) => {
    if (!user) return

    try {
      await likeReview(reviewId)

      // Update reviews locally
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, likes_count: (review.likes_count || 0) + 1 } : review,
        ),
      )
    } catch (err) {
      console.error("Error liking review:", err)
    }
  }

  const handleExpandReview = async (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null)
      return
    }

    setExpandedReview(reviewId)

    // Fetch comments if not already loaded
    if (!comments[reviewId]) {
      try {
        const { data } = await getComments(reviewId)
        setComments((prev) => ({
          ...prev,
          [reviewId]: data || [],
        }))
      } catch (err) {
        console.error("Error fetching comments:", err)
      }
    }
  }

  const handleSubmitComment = async (reviewId: string) => {
    if (!newComment.trim() || !user) return

    try {
      await submitComment(reviewId, user.id, newComment)

      // Refresh comments
      const { data } = await getComments(reviewId)
      setComments((prev) => ({
        ...prev,
        [reviewId]: data || [],
      }))

      // Clear input
      setNewComment("")
    } catch (err) {
      console.error("Error submitting comment:", err)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-xl font-bold">Community Reviews</h2>
          <p className="text-sm text-gray-500">Share your journey and connect with others</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your experience..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmitReview} disabled={submitting || !newReview.trim()} className="w-full">
            {submitting ? "Posting..." : "Post Review"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No reviews yet. Be the first to share!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4 pt-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    {review.users?.photo_url ? (
                      <AvatarImage src={review.users.photo_url} alt="User" />
                    ) : (
                      <AvatarFallback>{review.users?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.users?.email || "Anonymous"}</p>
                        <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-2">{review.content}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 pt-0 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(review.id)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {review.likes_count || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExpandReview(review.id)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {expandedReview === review.id ? "Hide" : "Comments"}
                </Button>
              </CardFooter>

              {expandedReview === review.id && (
                <div className="bg-gray-50 p-3 space-y-3">
                  {comments[review.id]?.length > 0 ? (
                    <div className="space-y-3">
                      {comments[review.id].map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-2">
                          <Avatar className="w-6 h-6">
                            {comment.users?.photo_url ? (
                              <AvatarImage src={comment.users.photo_url} alt="User" />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {comment.users?.email?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 bg-white p-2 rounded-md">
                            <p className="text-xs font-medium">{comment.users?.email || "Anonymous"}</p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No comments yet</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button size="icon" onClick={() => handleSubmitComment(review.id)} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

